import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import AuthProvider from "../common/AuthProvider";

function AppLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter: require("../assets/Inter.ttf"),
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

export default AppLayout;
