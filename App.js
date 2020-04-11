import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

import TcpSocket from 'react-native-tcp-socket';
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
    const serverPort = Number(9 + (Math.random() * 999).toFixed(0));
    const serverHost = '0.0.0.0';
    let server;
    let client;
    let client2;
    server = TcpSocket.createServer((socket) => {
      this.updateChatter(
        'server connected on ' + JSON.stringify(socket.address()),
      );

      connectedSockets.push(socket);
      socket.on('data', (data) => {
        this.updateChatter('Server Received: ' + data);
        socket.write('Echo server\r\n');
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

    client = TcpSocket.createConnection(
      {
        port: serverPort,
        host: serverHost,
        localAddress: '127.0.0.1',
        reuseAddress: true,
        // localPort: 20000,
        // interface: "wifi",
        // tls: true
      },
      (address) => {
        this.updateChatter('opened client on ' + JSON.stringify(address));
        client.write('Hello, server! Love, Client.');
      },
    );

    client.on('data', (data) => {
      console.log(client);
      //connectedSockets.map((elem, index) => console.log(elem));
      this.updateChatter('Client Received: ' + data);
      //this.client.destroy(); // kill client after server's response
      //this.server.close();
    });

    client.on('error', (error) => {
      this.updateChatter('client error ' + error);
    });

    client.on('close', () => {
      this.updateChatter('client close');
    });

    client2 = TcpSocket.createConnection(
      {
        port: serverPort,
        host: serverHost,
        localAddress: '127.0.0.1',
        reuseAddress: true,
        // localPort: 20000,
        // interface: "wifi",
        // tls: true
      },
      (address) => {
        this.updateChatter('opened client2 on ' + JSON.stringify(address));
        client2.write('Hello, server! Love, client2.');
      },
    );

    client2.on('data', (data) => {
      this.updateChatter('client2 Received: ' + data);
      this.client2.destroy(); // kill client2 after server's response
      this.server.close();
    });

    client2.on('error', (error) => {
      this.updateChatter('client2 error ' + error);
    });

    client2.on('close', () => {
      this.updateChatter('client close');
      connectedSockets.map((elem, index) =>
        elem._destroyed === true ? console.log('des') : null,
      );
    });
    this.server = server;
    this.client = client;
    this.client2 = client2;
  }

  componentWillUnmount() {
    this.server = null;
    this.client = null;
  }

  render() {
    return (
      <View style={styles.container}>
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
