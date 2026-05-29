import { Tabs } from "expo-router";
import { MaterialIcons } from '@react-native-vector-icons/material-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'index':
              iconName = focused ? 'menu-book' : 'menu-book';
              break;
            case 'favorite':
              iconName = focused ? 'favorite' : 'favorite-border';
              break;
            case 'explore':
              iconName = focused ? 'search' : 'search';
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
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "Perpustakaan",
          tabBarLabel: "Perpustakaan"
        }} 
      />
      <Tabs.Screen 
        name="favorite" 
        options={{ 
          title: "Favorit",
          tabBarLabel: "Favorit"
        }} 
      />
      <Tabs.Screen 
        name="explore" 
        options={{ 
          title: "Cari Buku",
          tabBarLabel: "Cari Buku"
        }} 
      />
    </Tabs>
  );
}