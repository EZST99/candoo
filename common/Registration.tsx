import React, { useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "./AuthProvider";
import Button from "./components/Button";
import Input from "./components/Input";
//Import Login Funktion from Login.tsx um nach Registrierung automatisch einzuloggen
//import { handleLogin } from "./Login";

function Registration() {
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
    <SafeAreaView>
      <Text>Registration</Text>
      <Input
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Input
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleRegistration} />
    </SafeAreaView>
  );
}

export default Registration;
