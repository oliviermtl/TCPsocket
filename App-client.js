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

const serverPort = 9803;
let serverHost = '192.168.2.107';
let myIP = '';
let client;

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

  socketStart(_myIP) {
    client = TcpSocket.createConnection(
      {
        port: serverPort,
        host: serverHost,
        localAddress: _myIP,
        reuseAddress: true,
        localPort: 40329,
        // interface: "wifi",
        // tls: true
      },
      (address) => {
        // this.updateChatter('opened client on ' + JSON.stringify(address));
        client.write(
          `Hello server! sent from: ${_myIP} to ${JSON.stringify(address)}`,
        );
      },
    );
    client.on('data', (data) => {
      this.updateChatter('Received from server: ' + data);
    });

    client.on('error', (error) => {
      this.updateChatter('client error ' + error);
    });

    client.on('close', () => {
      this.updateChatter('client close');
    });
  }
  componentDidMount() {
    // Get IPv4 IP (priority: WiFi first, cellular second)
    NetworkInfo.getIPV4Address().then((ipv4Address) => {
      myIP = ipv4Address;

      this.updateChatter('ipv4Address ' + ipv4Address);
      this.socketStart(myIP);
      this.myIP = myIP;
      this.client = client;
    });
  }

  componentWillUnmount() {
    this.client = null;
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View styles={{heigth: 100}}>
            <Button
              title="emit"
              onPress={() => {
                try {
                  client.write(this.myIP);
                } catch (e) {
                  this.socketStart(myIP);
                  this.updateChatter('connection lost');
                }
              }}
            />
            <Button
              title="connect"
              onPress={() => {
                this.socketStart(myIP);
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
