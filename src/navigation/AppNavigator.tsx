import React, { useRef, useEffect } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Linking } from 'react-native';
import { RootStackParamList } from '../types';
import Colors from '../utils/colors';

import SplashScreen from '../screens/SplashScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import FavouritesScreen from '../screens/FavouritesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.textLight,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
        },
      }}
    >
      <Tab.Screen
        name='ProductList'
        component={ProductListScreen}
        options={{
          title: 'Products',
          tabBarLabel: 'Products',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color }}>{focused ? '🛍️' : '🛒'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name='Favourites'
        component={FavouritesScreen}
        options={{
          title: 'Favourites',
          tabBarLabel: 'Favourites',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color: focused ? '#FF3B30' : color }}>
              {focused ? '❤️' : '🤍'}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const linking = {
  prefixes: [
    'myshoplite://',
  ],
  config: {
    screens: {
      Splash: 'splash',
      Main: {
        path: 'main',
        screens: {
          ProductList: 'products',
          Favourites: 'favourites',
        },
      },
      ProductDetails: 'product/:productId',
    },
  },
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    console.log('🔗 getInitialURL called, result:', url);

    // If it's a product deep link, we want to handle it specially
    if (url && url.includes('myshoplite://product/')) {
      console.log('🎯 Product deep link detected:', url);
    }

    return url;
  },
  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({ url }: { url: string }) => {
      console.log('🔗 Deep link URL received in subscribe:', url);
      listener(url);
    };

    const linkingListener = Linking.addEventListener('url', onReceiveURL);

    return () => {
      linkingListener?.remove();
    };
  },
};

const AppNavigator: React.FC = () => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const checkInitialURL = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          console.log('🔗 Initial URL detected:', url);
          handleDeepLink(url);
        }
      } catch (error) {
        console.error('❌ Error checking initial URL:', error);
      }
    };

    const handleDeepLink = (url: string) => {
      console.log('🎯 Processing deep link:', url);

      const productMatch = url.match(/myshoplite:\/\/product\/(.+)/);
      if (productMatch) {
        const productId = productMatch[1];
        console.log('📱 Product deep link detected, productId:', productId);

        if (navigationRef.current?.isReady()) {
          console.log('✅ Navigation ready, navigating to ProductDetails');
          navigationRef.current.navigate('ProductDetails', { productId });
        } else {
          console.log('⏳ Navigation not ready, waiting...');
          setTimeout(() => {
            if (navigationRef.current?.isReady()) {
              console.log('✅ Navigation ready after timeout, navigating to ProductDetails');
              navigationRef.current.navigate('ProductDetails', { productId });
            }
          }, 1000);
        }
      }
    };

    checkInitialURL();

    const linkingListener = Linking.addEventListener('url', ({ url }) => {
      console.log('🔗 URL event received:', url);
      handleDeepLink(url);
    });

    return () => {
      linkingListener?.remove();
    };
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onStateChange={state => {
        console.log(
          '🧭 Navigation state changed:',
          JSON.stringify(state, null, 2),
        );
      }}
      onReady={() => {
        console.log('🚀 Navigation container ready');
      }}
      fallback={<Text>Loading...</Text>}
    >
      <Stack.Navigator
        initialRouteName='Splash'
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name='Splash'
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Main'
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='ProductDetails'
          component={ProductDetailsScreen}
          options={{
            title: 'Product Details',
            headerBackTitle: '',
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
