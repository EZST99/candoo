import React, { useState } from "react";
import { Button, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "./AuthProvider";
//Import Login Funktion from Login.tsx um nach Registrierung automatisch einzuloggen
//import { Login } from "./Login";

function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // declared but value never read
  const { setSessionId } = useUser();

  async function Registration() {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    fetch("/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Erfolgreiche Registrierung
        console.log("Registration successful:", data);
        //Automatisches Einloggen nach erfolgreicher Registrierung
        //Login();
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      });
  }

  return (
    <SafeAreaView>
      <Text>Registration</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
      />
      <Button title="Register" onPress={Registration} />
    </SafeAreaView>
  );
}

export default Registration;
