import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import FavoriteScreen from './src/screens/FavoriteScreen';
import BooksOpenLibrary from './src/screens/BooksOpenLibrary';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Perpustakaan" component={HomeScreen} />
        <Tab.Screen name="Open Library" component={BooksOpenLibrary} />
        <Tab.Screen name="Favorit" component={FavoriteScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}