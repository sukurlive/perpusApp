import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Perpustakaan" }} />
      <Tabs.Screen name="favorite" options={{ title: "Favorit" }} />
    </Tabs>
  );
}