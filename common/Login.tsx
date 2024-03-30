import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Button, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "./AuthProvider";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setSessionId } = useUser();

  async function handleLogin() {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        SecureStore.setItem("sessionId", data.sessionId);
        console.log(data.sessionId);
        setSessionId(data.sessionId);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <SafeAreaView>
      <Text>Login</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </SafeAreaView>
  );
}

export default Login;
