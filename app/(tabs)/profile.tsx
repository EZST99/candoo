import * as SecureStore from "expo-secure-store";
import { Button, Text, View } from "react-native";
import { useUser } from "../../common/AuthProvider";

function Profile() {
  const { setSessionId } = useUser();

  return (
    <View>
      <Text>Logout</Text>
      <Button
        title="Logout"
        onPress={async () => {
          await SecureStore.deleteItemAsync("sessionId");
          setSessionId(null);
        }}
      />
    </View>
  );
}

export default Profile;
