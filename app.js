import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import FavoriteScreen from './src/screens/FavoriteScreen';
import BooksOpenLibrary from './src/screens/BooksOpenLibrary';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Perpustakaan':
                iconName = focused ? 'menu-book' : 'menu-book';
                break;
              case 'Open Library':
                iconName = focused ? 'search' : 'search';
                break;
              case 'Favorit':
                iconName = focused ? 'favorite' : 'favorite-border';
                break;
              default:
                iconName = 'help';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4a90e2',
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          headerStyle: {
            backgroundColor: '#4a90e2',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Perpustakaan" 
          component={HomeScreen} 
          options={{
            title: 'Perpustakaan Digital'
          }}
        />
        <Tab.Screen 
          name="Open Library" 
          component={BooksOpenLibrary} 
          options={{
            title: 'Cari Buku Online'
          }}
        />
        <Tab.Screen 
          name="Favorit" 
          component={FavoriteScreen} 
          options={{
            title: 'Buku Favorit'
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}