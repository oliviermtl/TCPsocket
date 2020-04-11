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

const connectedSockets = [];

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
    const serverPort = 9803;
    let serverHost = '';
    let myIP = '';
    let server;
    let client;

    // Get IPv4 IP (priority: WiFi first, cellular second)
    NetworkInfo.getIPV4Address().then((ipv4Address) => {
      myIP = ipv4Address;
      serverHost = myIP;

      this.updateChatter('ipv4Address ' + ipv4Address);
      server = TcpSocket.createServer((socket) => {
        connectedSockets.push(socket);
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
          connectedSockets.pop(socket);
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

      this.server = server;
    });
  }

  componentWillUnmount() {
    this.server = null;
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View styles={{heigth: 100}}>
            <Button
              title="emit"
              onPress={() => {
                connectedSockets.map((elem, index) =>
                  elem._destroyed === false
                    ? null
                    : connectedSockets[index].write('Hello from server'),
                );
              }}
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
