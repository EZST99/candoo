import { Stack } from "expo-router";

function AppLayout() {
  return <Stack.Screen name="(tabs)" options={{ headerShown: false }} />;
}

export default AppLayout;
