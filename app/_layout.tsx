import { Stack } from "expo-router";
import AuthProvider from "../common/AuthProvider";

function AppLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

export default AppLayout;
