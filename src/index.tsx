import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import App from './App';

// Register the app for React Native
if (Platform.OS !== 'web') {
  AppRegistry.registerComponent('ElectronicEcomm', () => App);
}

export default App;