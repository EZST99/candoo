import * as SecureStore from "expo-secure-store";
import { StyleSheet, View, Text } from "react-native";
import { useUser } from "../../common/AuthProvider";
import Button from "../../common/components/Button";

function Profile() {
  const { user, setSessionId } = useUser();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Profile Info</Text>
      </View>
      <View style={styles.userDetailsContainer}>
        <View style={styles.userDetail}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{user?.username}</Text>
        </View>
        <View style={styles.userDetail}>
          <Text style={styles.label}>Email: </Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
      </View>
      <View style={styles.btn}>
        <Button
          title="Logout"
          onPress={async () => {
            await SecureStore.deleteItemAsync("sessionId");
            setSessionId(null);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    position: "absolute",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter",
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
  },
  titleContainer: {
    paddingBottom: 24,
  },
  userDetailsContainer: {
    marginBottom: 24,
  },
  userDetail: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    marginRight: 8,
    fontSize: 18,
  },
  value: {
    flex: 1,
    fontSize: 18,
  },
  btn: {
    width: "100%",
    alignItems: "center",
  },
});

export default Profile;
