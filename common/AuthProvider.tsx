import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import Login from "./Login";

interface User {
  username: string;
}

interface AuthProviderData {
  user: User | null;
  setSessionId: (sessionId: string | null) => void;
}

const AuthContext = createContext<AuthProviderData>({ user: null, setSessionId: () => console.log("not initialized") });
export const useUser = () => useContext(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<null | string>(
    SecureStore.getItem("sessionId")
  );
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("sessionId", sessionId);
    if (sessionId === null) {
      setUser(null);
      return;
    }

    fetch("/api/user", {
      headers: {
        Authorization: `Bearer ${sessionId}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => {
        console.error(error);
      });
  }, [sessionId]);

  return (
    <AuthContext.Provider value={{ user, setSessionId }}>
      {user === null ? <Login /> : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
