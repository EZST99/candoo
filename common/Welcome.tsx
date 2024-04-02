import React, { useEffect } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import Login from "./Login";
import Registration from "./Registration";
import Button from "./components/Button";

function Welcome() {
  const [view, setView] = React.useState<null | "login" | "register">(null);

  useEffect(() => {
    const backAction = () => {
      if (view !== null) {
        setView(null);
        return true;
      }

      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [view]);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerContent}>candoo</Text>
      </View>
      <View style={styles.container}>
        {view === null ? (
          <View style={styles.selection}>
            <Button title="Login" onPress={() => setView("login")} />
            <Button title="Register" onPress={() => setView("register")} />
          </View>
        ) : null}
        {view === "login" ? <Login back={() => setView(null)} /> : null}
        {view === "register" ? (
          <Registration back={() => setView(null)} />
        ) : null}
      </View>
    </View>
  );
}

export default Welcome;

const styles = StyleSheet.create({
  page: {
    display: "flex",
    flexDirection: "column",
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
  container: {
    flex: 1,
  },
  selection: {
    display: "flex",
    justifyContent: "center",
    padding: 24,
    gap: 24,
    height: "80%",
  },
});
