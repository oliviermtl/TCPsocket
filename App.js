import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
} from 'react-native';

import TcpSocket from 'react-native-tcp-socket';
import {NetworkInfo} from 'react-native-network-info';

// Get Local IP

class App extends React.Component {
  constructor(props) {
    super(props);

    this.updateChatter = this.updateChatter.bind(this);
    this.state = {chatter: []};
  }

  updateChatter(msg) {
    this.setState({
      chatter: this.state.chatter.concat([msg]),
    });
  }

  componentDidMount() {
    const serverPort = 9802;
    const serverHost = '192.168.2.107';
    let myIP = '';
    let server;
    let client;

    // Get IPv4 IP (priority: WiFi first, cellular second)
    NetworkInfo.getIPV4Address().then((ipv4Address) => {
      myIP = ipv4Address;
      console.log(myIP);

      this.updateChatter('ipv4Address ' + ipv4Address);
      server = TcpSocket.createServer((socket) => {
        this.updateChatter(
          'server connected on ' + JSON.stringify(socket.address()),
        );

        socket.on('data', (data) => {
          this.updateChatter('Server Received: ' + data);
          socket.write('Echo server\r\n' + data);
        });

        socket.on('error', (error) => {
          this.updateChatter('server client error ' + error);
        });

        socket.on('close', (error) => {
          this.updateChatter('server client closed ' + (error ? error : ''));
        });
      }).listen(
        {port: serverPort, host: serverHost, reuseAddress: true},
        (address) => {
          this.updateChatter('opened server on ' + JSON.stringify(address));
        },
      );

      server.on('error', (error) => {
        this.updateChatter('Server error ' + error);
      });

      server.on('close', () => {
        this.updateChatter('server close');
      });

      client = TcpSocket.createConnection(
        {
          port: 9803,
          host: '192.168.2.108',
          localAddress: '192.168.2.107',
          reuseAddress: true,
          localPort: 40329,
          // interface: "wifi",
          // tls: true
        },
        (address) => {
          this.updateChatter('opened client on ' + JSON.stringify(address));
          client.write('Hello, server! Love, Client.');
        },
      );

      client.on('data', (data) => {
        this.updateChatter('Client Received: ' + data);
        // this.client.destroy(); // kill client after server's response
        // this.server.close();
      });

      client.on('error', (error) => {
        this.updateChatter('client error ' + error);
      });

      client.on('close', () => {
        this.updateChatter('client close');
      });

      this.server = server;
      this.client = client;
    });
  }

  componentWillUnmount() {
    this.server = null;
    this.client = null;
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View styles={{heigth: 100}}>
            <Button
              title="emit"
              onPress={() => this.client.write('Socket emitted')}
            />
          </View>

          <ScrollView>
            {this.state.chatter.map((msg, index) => {
              return (
                <Text key={index} style={styles.welcome}>
                  {msg}
                </Text>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App;
