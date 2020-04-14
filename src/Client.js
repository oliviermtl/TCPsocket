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
let thisClient = {};

const Client = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [name, setName] = useState('');
  const [server, setServer] = useState('');
  const [ip, setIp] = useState('');
  const [feed, setFeed] = useState([]);
  const [connectionFeed, setConnectionFeed] = useState(0);

  function socketStart(_serverPort, _serverHost, _myIP) {
    let client = TcpSocket.createConnection(
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
        client.write(`Hello server! sent from: ${ip} ${name}`);
      },
    );
    client.on('data', (data) => {
      setFeed((feed) => [...feed, data.toString()]);
    });

    client.on('error', (error) => {
      setFeed((feed) => [...feed, 'Error received']);
      client.destroy();
      //setIsConnected(false);
    });

    client.on('close', () => {
      setFeed((feed) => [...feed, 'Close received']);
      setConnectionFeed((connectionFeed) => connectionFeed + 1);
      setIsConnected(false);
      setFeed((feed) => [...feed, 'Start reconnect routine from on close']);
      console.log(client._id);
      client.destroy();
      retrySocket();
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

  // Retrieve & Return server address and client name in asyncStorage
  const getConnectionDetails = async () => {
    let values;
    try {
      values = await AsyncStorage.multiGet(['@server', '@name']);
    } catch (e) {
      // read error
    }
    console.log(values);
    return values;
    // example console.log output:
    // [ ['@MyApp_user', 'myUserValue'], ['@MyApp_key', 'myKeyValue'] ]
  };

  // Get local IP address
  const getIp = async () => {
    let _ip = await NetworkInfo.getIPV4Address();
    return _ip;
  };

  useEffect(() => {
    getIp().then((value) => setIp(value));
    getConnectionDetails().then((values) => {
      setServer(values[0][1]);
      setName(values[1][1]);
    });

    return () => {};
  }, []);

  useEffect(() => {
    setFeed((feed) => [...feed, connectionFeed.toString()]);
    return () => {};
  }, [connectionFeed]);

  const retrySocket = () => {
    setTimeout(function () {
      if (!isConnected) {
        setFeed((feed) => [...feed, `Trying to reconnect ${server}`]);
        console.log(server, ip);
        socketStart(serverPort, server, ip);
      } else {
        setFeed((feed) => [...feed, 'Socket is ok']);
      }
    }, 10000);
  };

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.columns}>
        <View style={styles.flex}>
          <Text>Server : {server}</Text>
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
            // disabled={isConnected}
            title="Save"
            onPress={() => {
              multiSet(server, name);
            }}
          />
          <Button
            style={styles.input}
            disabled={isConnected}
            title="Connect"
            onPress={() => {
              socketStart(serverPort, server, ip);
            }}
          />
        </View>

        <View style={styles.flex}>
          <Button
            style={styles.input}
            title="Clean Feed"
            onPress={() => {
              setFeed([]);
            }}
          />

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
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    margin: 8,
    borderRadius: 8,
  },
});

export default Client;
