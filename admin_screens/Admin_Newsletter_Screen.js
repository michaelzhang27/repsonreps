import {
  StyleSheet,
  View,
  Dimensions,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Input } from "react-native-elements";
import { db, firebase } from "../firebase";
import * as ImagePicker from "expo-image-picker";

const Admin_Newsletter_Screen = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const API_URL = "http://localhost:3000";

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const sendNewsLetter = async () => {
    if (image === "" || !title) {
      Alert.alert("Please Fill Out All Product Details and Try Again");
      return;
    }

    setUploading(true);
    const response = await fetch(image);
    const blob = await response.blob();
    const filename = image.substring(image.lastIndexOf("/") + 1);

    var ref = firebase
      .storage()
      .ref()
      .child("newsletterImages/" + filename)
      .put(blob)
      .on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          console.log(
            "progress: " +
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (error) => {
          console.log(error);
        },
        () => {
          firebase
            .storage()
            .ref("newsletterImages/" + filename)
            .getDownloadURL()
            .then((url) => {
              actuallysendletter(url);
            });

          setUploading(false);
          setImage("");
          Alert.alert("Newsletter Has Been Sent");
        }
      );
    try {
      await ref;
    } catch (e) {
      console.log(e);
    }
  };

  const actuallysendletter = async (url) => {
    const docRef = db.collection("newsletter").doc("users");
    try {
      const doc = await docRef.get();
      if (doc.exists) {
        const data = doc.data();
        console.log("Fetched data:", data.emails);
        const response = await fetch(`${API_URL}/newsletter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title,
            image: url,
            emails: data.emails,
          }),
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching document: ", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.ic}>
        <Input
          value={title}
          onChangeText={(text) => setTitle(text)}
          placeholder="Subject Title"
        />
        {uploading === false && (
          <Button onPress={pickImage} title={"Pick Newsletter Image"} />
        )}
        {uploading === true && (
          <Button disabled raised title={"Loading . . ."} />
        )}
      </View>
      <View style={styles.ic}>
        {uploading === false && (
          <Button onPress={sendNewsLetter} title={"Send Newsletter"} />
        )}
        {uploading === true && (
          <Button disabled raised title={"Loading . . ."} />
        )}
      </View>
      {image != "" && (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Image source={{ uri: image }} style={{ width: 200, height: 300 }} />
        </View>
      )}
    </ScrollView>
  );
};

export default Admin_Newsletter_Screen;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: "95%",
    height: "90%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    alignSelf: "center",
  },
  ic: {
    alignItems: "center",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "white",
  },
  image: {
    height: Dimensions.get("screen").height * 0.35,
    width: Dimensions.get("screen").height * 0.35,
    borderRadius: 20,
  },
});
