import React, { useEffect } from "react";
import { BackHandler, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

  if (view === "login") return <Login />;
  if (view === "register") return <Registration />;
  return (
    <SafeAreaView>
      <Button title="Login" onPress={() => setView("login")} />
      <Button title="Register" onPress={() => setView("register")} />
    </SafeAreaView>
  );
}

export default Welcome;

const styles = StyleSheet.create({});
