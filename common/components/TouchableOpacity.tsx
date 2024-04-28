import React from "react";
import { StyleSheet, TouchableOpacityProps, TouchableOpacity as TouchableReact } from "react-native";

function TouchableOpacity(props: TouchableOpacityProps) {
  return <TouchableReact {...props} style={styles.base} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "rgba(255, 0, 0, 0.72)",
    padding: 10,
    height: 60,
    width: 60,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TouchableOpacity;