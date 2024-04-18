import React from "react";
import { StyleSheet, TouchableOpacityProps, TouchableOpacity as TouchableReact  } from "react-native";

function TouchableOpacity(props: TouchableOpacityProps) {
  return <TouchableReact {...props} style={styles.base} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#ff00003b",
    padding: 10,
    borderRadius: 10,
  },
});

export default TouchableOpacity;