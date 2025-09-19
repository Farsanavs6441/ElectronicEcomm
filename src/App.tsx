import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { LoadingProvider } from './context/LoadingContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider } from './context/CartContext';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <CartProvider>
      <FavoritesProvider>
        <LoadingProvider>
          <SafeAreaProvider>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              backgroundColor='#007AFF'
            />
            <AppNavigator />
          </SafeAreaProvider>
        </LoadingProvider>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;
