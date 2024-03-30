import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
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
    <View>
      <View style={styles.header}>
        <Text style={styles.headerContent}>Candoo</Text>
      </View>
      <View style={styles.container}>
        <Text>Login</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    </View>
  );
}

/*


position: absolute;
width: 308px;
height: 66px;
left: 42px;
top: 297px;

background: rgba(255, 0, 0, 0.23);
border-radius: 10px;


*/

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ff0000b8",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    fontSize: 60,
    lineHeight: 73,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#FFFFFF",
  },
  container: {
    justifyContent: "center",
    padding: 24,
  },
  input: {
    backgroundColor: "#ff00003b",
    padding: 10,
    borderRadius: 10,
  },
});

export default Login;
