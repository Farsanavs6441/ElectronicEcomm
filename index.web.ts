import { AppRegistry } from 'react-native';
import App from './src/App.web';
import appConfig from './app.json';

// Register the main component
AppRegistry.registerComponent(appConfig.name, () => App);

// Run the app
const rootTag = document.getElementById('root');
if (rootTag) {
  AppRegistry.runApplication(appConfig.name, {
    rootTag,
  });
} else {
  console.error(
    'Root element not found. Make sure you have a div with id="root" in your HTML.',
  );
}
