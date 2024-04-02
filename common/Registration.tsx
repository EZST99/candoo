import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useUser } from "./AuthProvider";
import Button from "./components/Button";
import Input from "./components/Input";
//Import Login Funktion from Login.tsx um nach Registrierung automatisch einzuloggen
//import { handleLogin } from "./Login";

interface RegistrationProps {
  back: () => void;
}

function Registration({ back }: RegistrationProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // declared but value never read
  const { setSessionId } = useUser();

  async function handleRegistration() {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    fetch("/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Erfolgreiche Registrierung
        console.log("Registration successful:", data);
        //Automatisches Einloggen nach erfolgreicher Registrierung
        setSessionId(data.sessionId);
      })
      .catch((error) => {
        console.error("Registration failed:", error);
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
          <Text style={styles.title}>Create account</Text>
        </View>
        <View style={styles.form}>
          <Input
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
            autoComplete="username-new"
          />
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoComplete="email"
          />
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            autoComplete="new-password"
            secureTextEntry
          />
          <Input
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            secureTextEntry
          />
        </View>
      </View>
      <View style={styles.btn}>
        <Button title="Let's get started" onPress={handleRegistration} />
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

export default Registration;
