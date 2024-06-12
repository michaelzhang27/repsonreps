import "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase, auth } from "../../firebase.js";
import { SafeAreaView } from "react-native-safe-area-context";

const Top_Bar = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState("");
  const [name, setName] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      setUser({
        profilePictureURL:
          "https://firebasestorage.googleapis.com/v0/b/reps-on-reps.appspot.com/o/logo.png?alt=media&token=1542eeea-6315-450e-b72b-d48e05f3f3dc",
      });
      setName("Player");
    } else {
      setLoggedIn(true);
      firebase
        .firestore()
        .collection("users")
        .doc(auth.currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
            setName(snapshot.data().name);
          }
        });
    }
  }, []);

  const fName = name.split(" ");

  return (
    <View style={styles.iconsContainer}>
      <View>
        <Text style={styles.slogan}>Let's Work, </Text>
        <Text style={styles.name}>{fName[0]}</Text>
      </View>
      {loggedIn && (
        <Pressable onPress={() => navigation.navigate("Account_Screen")}>
          <Image
            style={{ height: 60, width: 60, borderRadius: 30 }}
            source={{ uri: user.profilePictureURL }}
          />
        </Pressable>
      )}
      {!loggedIn && (
        <Pressable
          onPress={() => {
            Alert.alert("Please Login or Sign up to Continue");
            navigation.navigate("Login_Screen");
          }}
        >
          <Image
            style={{ height: 60, width: 60, borderRadius: 30 }}
            source={{ uri: user.profilePictureURL }}
          />
        </Pressable>
      )}
    </View>
  );
};

export default Top_Bar;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "flex-end",
    position: "absolute",
    top: 0,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 30,
    alignItems: "center",
  },
  slogan: {
    fontSize: Dimensions.get("screen").width * 0.05,
  },
  name: {
    fontSize: Dimensions.get("screen").width * 0.1,
    fontWeight: "bold",
  },
});
