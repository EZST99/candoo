import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

function Input(props: TextInputProps) {
  return <TextInput {...props} style={styles.base} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.19)",
    padding: 10,
    margin: 10,
    borderRadius: 20,
    textAlign: "center",
  },
});

export default Input;
