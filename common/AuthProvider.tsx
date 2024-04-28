import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import React, { createContext, useContext, useEffect, useState } from "react";
import Welcome from "./Welcome";

interface User {
  username: string;
}

interface AuthProviderData {
  user: User | null;
  setSessionId: (sessionId: string | null) => void;
}

const AuthContext = createContext<AuthProviderData>({
  user: null,
  setSessionId: () => console.log("not initialized"),
});
export const useUser = () => useContext(AuthContext);
SplashScreen.preventAutoHideAsync();

interface Props {
  children: React.ReactNode;
  fontsLoaded: boolean;
}

function AuthProvider({ children, fontsLoaded }: Props) {
  const [sessionId, setSessionId] = useState<null | string>(
    SecureStore.getItem("sessionId")
  );
  const [user, setUser] = useState<User | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    if (sessionId == null) {
      setUser(null);
      setAppIsReady(true);
      return;
    }

    fetch("/api/user", {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    })
      .then((response) => response.json())
      .then((data) => data && setUser(data))
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setAppIsReady(true);
      });
  }, [sessionId]);

  useEffect(() => {
    if (!appIsReady || !fontsLoaded) return;
    SplashScreen.hideAsync();
  }, [fontsLoaded, appIsReady]);

  return (
    <AuthContext.Provider value={{ user, setSessionId }}>
      {user === null ? <Welcome /> : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
