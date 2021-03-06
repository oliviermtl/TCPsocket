/**
 * @format
 */

import {AppRegistry} from 'react-native';
//Client
// import App from './App-client';

//Server
// import App from './App-server';

//Emulator
// import App from './App';

import Client from './src/Client';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Client);
