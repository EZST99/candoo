import { AntDesign } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useUser } from "./AuthProvider";
import Button from "./components/Button";
import Input from "./components/Input";

interface LoginProps {
  back: () => void;
}

function Login({ back }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setSessionId } = useUser();

  async function handleLogin() {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          setError("Invalid credentials");

        }
        return response;
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
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View>
            <AntDesign
              name="arrowleft"
              size={24}
              color="black"
              onPress={back}
            />
          </View>
          <Text style={styles.title}>Login</Text>
        </View>
        <View style={styles.form}>
          <Input
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            autoComplete="username"
          />
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            autoComplete="current-password"
            secureTextEntry
          />
        </View>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
      <View style={styles.btn}>
        <Button title="Let's get started" onPress={handleLogin} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 24,
  },
  form: {
    display: "flex",
    gap: 10,
  },
  btn: {
    position: "absolute",
    bottom: 24,
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#000000",
    flex: 1,
    textAlign: "center",
    transform: [{ translateX: -12 }],
  },
});

export default Login;
