import { Image } from 'expo-image';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Welcome from './Welcome';

interface User {
  username: string;
  email: string;
  password: string;
}

interface AuthProviderData {
  user: User | null;
  setSessionId: (sessionId: string | null) => void;
}

const AuthContext = createContext<AuthProviderData>({
  user: null,
  setSessionId: () => console.log('not initialized'),
});
export const useUser = () => useContext(AuthContext);
SplashScreen.preventAutoHideAsync();

interface Props {
  children: React.ReactNode;
}

function AuthProvider({ children }: Props) {
  const [sessionId, setSessionId] = useState<null | string>(
    SecureStore.getItem('sessionId')
  );
  const [user, setUser] = useState<User | null>(null);
  const [appIsReady, setAppIsReady] = useState(false);
  const [isShowingAnimation, setIsShowingAnimation] = useState(true);

  useEffect(() => {
    if (sessionId == null) {
      setUser(null);
      setAppIsReady(true);
      return;
    }

    fetch('/api/user', {
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
    if (!appIsReady) return;
    SplashScreen.hideAsync();
  }, [appIsReady]);

  if (isShowingAnimation) {
    setTimeout(() => {
      setIsShowingAnimation(false);
    }, 1200);

    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require('../assets/splash.gif')}
          contentFit='contain'
        />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setSessionId }}>
      {user === null ? <Welcome /> : children}
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
  },
});

export default AuthProvider;
