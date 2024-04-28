import { Inter_900Black, useFonts } from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import AuthProvider from "../common/AuthProvider";

function AppLayout() {
  const [fontsLoaded] = useFonts({
    Inter: Inter_900Black,
  });

  return (
    <AuthProvider fontsLoaded={fontsLoaded}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

export default AppLayout;
