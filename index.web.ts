import {AppRegistry} from 'react-native';
import App from './App.web';
import appConfig from './app.json';

// Register the main component
AppRegistry.registerComponent(appConfig.name, () => App);

// Run the app
AppRegistry.runApplication(appConfig.name, {
  rootTag: document.getElementById('root'),
});