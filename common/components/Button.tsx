import React from "react";
import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

interface Props extends PressableProps {
  title: string;
}

function Button(props: Props) {
  return (
    <Pressable {...props} style={styles.pressable}>
      <Text style={styles.text}>{props.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: "#ff0000b8",
    padding: 10,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Inter",
    fontWeight: "700",
    textTransform: "uppercase",
  },
});

export default Button;
