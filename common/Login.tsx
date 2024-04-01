import { AntDesign } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useUser } from "./AuthProvider";
import Button from "./components/Button";
import Input from "./components/Input";

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
    <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <AntDesign name="arrowleft" size={24} color="black" />
        </View>
        <Text style={styles.headerContent}>candoo</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Login</Text>
        </View>
        <View style={styles.form}>
          <Input
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
          />
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
        </View>
      </View>
      <View style={styles.btn}>
        <Button title="Let's get started" onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    display: "flex",
    height: "100%",
  },
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
  titleContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    lineHeight: 29,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#000000",
    marginBottom: 20,
  },
  container: {
    display: "flex",
    padding: 24,
  },
  form: {
    display: "flex",
    gap: 10,
  },
  btn: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 24,
    display: "flex",
    alignItems: "center",
  },
});

export default Login;
