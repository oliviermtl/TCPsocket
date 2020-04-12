import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  TextInput,
} from 'react-native';

import TcpSocket from 'react-native-tcp-socket';
import {NetworkInfo} from 'react-native-network-info';

const serverPort = 9803;
let client = {};

const Client = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [name, setName] = useState('');
  const [server, setServer] = useState('');
  const [ip, setIp] = useState('');

  function socketStart(_serverPort, _serverHost, _myIP) {
    client = TcpSocket.createConnection(
      {
        port: _serverPort,
        host: _serverHost,
        localAddress: _myIP,
        reuseAddress: true,
        localPort: 40329,
        // interface: "wifi",
        // tls: true
      },
      (address) => {
        // this.updateChatter('opened client on ' + JSON.stringify(address));
        setIsConnected(true);
        client.write(
          `Hello server! sent from: ${_myIP} to ${JSON.stringify(address)}`,
        );
      },
    );
    client.on('data', (data) => {
      //this.updateChatter('Received from server: ' + data);
    });

    client.on('error', (error) => {
      setIsConnected(false);
      //this.updateChatter('client error ' + error);
    });

    client.on('close', () => {
      setIsConnected(false);
    });
  }
  const multiSet = async (_server, _name) => {
    const server = ['@server', _server];
    const name = ['@name', _name];
    try {
      await AsyncStorage.multiSet([server, name]);
    } catch (e) {
      console.log(e);
    }
    console.log('Done.');
  };

  const getMultiple = async () => {
    let values;
    try {
      values = await AsyncStorage.multiGet(['@server', '@name']);
      setServer(values[0][1]);
      setName(values[1][1]);
    } catch (e) {
      // read error
    }
    console.log(values);

    // example console.log output:
    // [ ['@MyApp_user', 'myUserValue'], ['@MyApp_key', 'myKeyValue'] ]
  };
  useEffect(() => {
    NetworkInfo.getIPV4Address().then((ipv4Address) => {
      setIp(ipv4Address);
    });
    getMultiple();

    return () => {};
  }, []);

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.columns}>
        <View style={styles.flex}>
          <Text>IP : {ip}</Text>
          <Text>{isConnected ? 'Connection ok' : 'Not Connected'}</Text>

          <TextInput
            style={styles.input}
            onChangeText={(text) => setServer(text)}
            value={server}
            placeholder={server}
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setName(text)}
            value={name}
            placeholder={name}
          />
          <Button
            disabled={isConnected}
            title="Connect"
            onPress={() => {
              multiSet(server, name);
              socketStart(serverPort, server, ip);
            }}
          />
        </View>

        <View style={styles.flex}>
          <Text>Right</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    margin: 8,
  },
  columns: {
    flexDirection: 'row',
  },
  input: {borderColor: 'gray', borderWidth: 1, margin: 8},
});

export default Client;
