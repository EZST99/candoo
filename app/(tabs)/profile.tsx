import * as SecureStore from "expo-secure-store";
import { StyleSheet, View, Text, TextInput, Alert } from "react-native";
import { useUser, } from "../../common/AuthProvider";
import Button from "../../common/components/Button";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import ButtonCircle from "../../common/components/ButtonCircle";
import { UserUpdateRequest } from "../api/userUpdate+api";
import authenticatedFetch from "../../common/authenticatedFetch";

function Profile() {
  const { user, setSessionId } = useUser();
  const [sessionId, setSessionIdd] = useState<null | string>(null);
  const [userInfo, setUserInfo] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: ""
  });
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const fetchSessionId = async () => {
      const id = await SecureStore.getItemAsync('sessionId');
      setSessionIdd(id);
    };

    fetchSessionId();
    console.log("session id: ", sessionId);
  }, []);

  const validateInput = () => {
    if (!userInfo.username || !userInfo.email) {
      Alert.alert("Validation Error", "All fields must be filled.");
      return false;
    }
    return true;
  };

  async function handleUserUpdate() {
    console.log('handleUserUpdate is called');
    if (!validateInput()) {
      return;
    }

    const body: UserUpdateRequest = {
      username: userInfo.username,
      email: userInfo.email
    };

    console.log("User Update Request:", body);

    authenticatedFetch("/api/userUpdate", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify(body),
    })
      .then((data) => {
        console.log("User Update successful:", data);
        Alert.alert("Success", "User info was successfully updated.");
      })
      .catch((error) => {
        console.error("User Update failed:", error);
        Alert.alert("Error", "Failed to update user info.");
      });
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Profile Info</Text>
      </View>
      <View style={styles.userDetailsContainer}>
        <View style={styles.userDetail}>
          <Text style={styles.label}>Name:</Text>
          {showEdit ?
            (<TextInput
              style={styles.value}
              onChangeText={(text) => setUserInfo({ ...userInfo, username: text })}
              value={userInfo.username}
              placeholder="Username"
            />)
            :
            (<Text style={styles.value}>{userInfo.username}</Text>)
          }
        </View>
        <View style={styles.userDetail}>
          <Text style={styles.label}>Email: </Text>
          {showEdit ?
            (<TextInput
              style={styles.value}
              onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
              value={userInfo.email}
              placeholder="Email"
            />)
            :
            (<Text style={styles.value}>{userInfo.email}</Text>)
          }
        </View>
      </View>
      {showEdit ?
        (<View style={styles.btn}>
          <ButtonCircle onPress={() => { handleUserUpdate(); setShowEdit(false); console.log("pressed update"); }}>
            <View>
              <Feather name="check" size={24} color="white" />
            </View>
          </ButtonCircle>
        </View>)
        :
        (<View style={styles.btn}>
          <Button
            title="Edit"
            onPress={() => { setShowEdit(true); console.log("pressed edit"); }}
          />
        </View>)
      }


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
    marginVertical: 10,
  },
});

export default Profile;
