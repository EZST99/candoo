import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

function Input(props: TextInputProps) {
  return <TextInput {...props} style={styles.base} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#ff00003b",
    padding: 10,
    borderRadius: 10,
  },
});

export default Input;
