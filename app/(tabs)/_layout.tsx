import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { 
          backgroundColor: '#4a90e2',
          elevation: 0, 
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: { 
          fontWeight: 'bold', 
          fontSize: 18 
        },
        tabBarStyle: { 
          backgroundColor: '#ffffff',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 8,
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: '#4a90e2',
        tabBarInactiveTintColor: '#999999',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Perpustakaan Digital",
          tabBarLabel: "Perpustakaan",
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons 
              name={focused ? "menu-book" : "menu-book"} 
              size={size} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="favorite" 
        options={{ 
          title: "Buku Favorit",
          tabBarLabel: "Favorit",
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons 
              name={focused ? "favorite" : "favorite-border"} 
              size={size} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="explore" 
        options={{ 
          title: "Cari Buku Online",
          tabBarLabel: "Cari Buku",
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialIcons 
              name={focused ? "search" : "search"} 
              size={size} 
              color={color} 
            />
          ),
        }} 
      />
      <Tabs.Screen 
        name="detail" 
        options={{ 
          href: null,
          title: "Detail Buku",
        }} 
      />
    </Tabs>
  );
}