import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { LoadingProvider } from './src/context/LoadingContext';
import { FavoritesProvider } from './src/context/FavoritesContext';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <FavoritesProvider>
      <LoadingProvider>
        <SafeAreaProvider>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor="#007AFF"
          />
          <AppNavigator />
        </SafeAreaProvider>
      </LoadingProvider>
    </FavoritesProvider>
  );
}

export default App;