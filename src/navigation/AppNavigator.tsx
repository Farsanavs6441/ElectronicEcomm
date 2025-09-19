import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
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
        name="ProductList"
        component={ProductListScreen}
        options={{
          title: 'Products',
          tabBarLabel: 'Products',
          tabBarIcon: ({ focused, color }) => (
            <Text style={{ fontSize: 24, color }}>
              {focused ? '🛍️' : '🛒'}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{
          title: 'My Favourites',
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
  prefixes: ['https://localhost:3002', 'http://localhost:3002', 'myshoplite://'],
  config: {
    screens: {
      Splash: 'splash',
      Main: 'main',
      ProductDetails: 'product/:productId',
    },
  },
};

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Splash"
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
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetails"
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