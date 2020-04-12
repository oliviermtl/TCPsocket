import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import {
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  TextInput,
  FlatList,
} from 'react-native';

import TcpSocket from 'react-native-tcp-socket';
import {NetworkInfo} from 'react-native-network-info';

const serverPort = 9803;
let client = {};
let dataFeed = [];
const Client = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [name, setName] = useState('');
  const [server, setServer] = useState('');
  const [ip, setIp] = useState('');
  const [feed, setFeed] = useState([]);

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
        client.write(`Hello server! sent from: ${_myIP} ${name}`);
      },
    );
    client.on('data', (data) => {
      setFeed((feed) => [...feed, data.toString()]);
      //dataFeed.push(data);
      console.log(data);
      //this.updateChatter('Received from server: ' + data);
    });

    client.on('error', (error) => {
      setIsConnected(false);
      //this.updateChatter('client error ' + error);
    });

    client.on('close', () => {
      setIsConnected(false);
    });
    return client;
  }

  // Set server address and client name in asyncStorage
  const multiSet = async (_server, _name) => {
    const server = ['@server', _server];
    const name = ['@name', _name];
    try {
      await AsyncStorage.multiSet([server, name]);
    } catch (e) {
      console.log(e);
    }
    console.log('Data saved to asyc storage');
  };

  // Retrieve server address and client name in asyncStorage
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

  // Get local IP address
  const getIp = async () => {
    let _ip = await NetworkInfo.getIPV4Address();
    setIp(_ip);
    console.log(`ip:${_ip}`);
  };

  useEffect(() => {
    getIp();
    getMultiple().then(socketStart(serverPort, server, ip));
    // socketStart(serverPort, server, ip);

    return () => {};
  }, []);

  useEffect(() => {}, []);

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
            style={styles.input}
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
          <FlatList
            extraData={feed}
            data={feed}
            renderItem={({item}) => <Text>{item}</Text>}
          />
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
  input: {borderColor: 'gray', borderWidth: 1, margin: 8, borderRadius: 8},
});

export default Client;
