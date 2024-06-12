import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { Input, Button } from "react-native-elements";
import { db, firebase } from "../firebase.js";
import * as ImagePicker from "expo-image-picker";

const Admin_Add_Session_Screen = () => {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(null);
  const [AMTime, setAMTime] = useState("");
  const [AMLocation, setAMLocation] = useState("");
  const [PMTime, setPMTime] = useState("");
  const [PMLocation, setPMLocation] = useState("");
  const [image, setImage] = useState("");
  const [btnLoading, setBTNLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const addAMSession = async () => {
    // here, make uploadImage part of addAMSession, add image to
    // storage first, then at once update image w/ url
    if (
      !date ||
      !name ||
      !AMTime ||
      !AMLocation ||
      !title ||
      !price ||
      image === ""
    ) {
      Alert.alert("Please Fill in Date and Name and AM Details");
      return;
    }
    let id = "Coach" + name + AMTime + "AM";
    setBTNLoading(true);
    const response = await fetch(image);
    const blob = await response.blob();
    const filename = image.substring(image.lastIndexOf("/") + 1);

    var ref = firebase
      .storage()
      .ref()
      .child("calendarImages/" + filename)
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
            .ref("calendarImages/" + filename)
            .getDownloadURL()
            .then((url) => {
              db.collection("calendar")
                .doc(date)
                .get()
                .then((snapshot) => {
                  if (snapshot.exists) {
                    db.collection("calendar")
                      .doc(date)
                      .update({
                        [id]: {
                          id,
                          name,
                          time: AMTime + "AM",
                          location: AMLocation,
                          date,
                          title,
                          price,
                          image: url,
                        },
                      });
                    setBTNLoading(false);
                    Alert.alert(
                      "Session added, a refresh may be needed to see change"
                    );
                  } else {
                    db.collection("calendar")
                      .doc(date)
                      .set({
                        [id]: {
                          id,
                          name,
                          time: AMTime + "AM",
                          location: AMLocation,
                          date,
                          title,
                          price,
                          image: url,
                        },
                      });
                    setBTNLoading(false);
                    Alert.alert(
                      "Session added, a refresh may be needed to see change"
                    );
                  }
                });
            });
        }
      );
    try {
      await ref;
    } catch (e) {
      console.log(e);
    }
  };

  const addPMSession = async () => {
    if (
      !date ||
      !name ||
      !PMTime ||
      !PMLocation ||
      !title ||
      !price ||
      image === ""
    ) {
      Alert.alert("Please Fill in Date and Name and AM Details");
      return;
    }
    let id = "Coach" + name + PMTime + "PM";
    setBTNLoading(true);
    const response = await fetch(image);
    const blob = await response.blob();
    const filename = image.substring(image.lastIndexOf("/") + 1);

    var ref = firebase
      .storage()
      .ref()
      .child("calendarImages/" + filename)
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
            .ref("calendarImages/" + filename)
            .getDownloadURL()
            .then((url) => {
              db.collection("calendar")
                .doc(date)
                .get()
                .then((snapshot) => {
                  if (snapshot.exists) {
                    db.collection("calendar")
                      .doc(date)
                      .update({
                        [id]: {
                          id,
                          name,
                          time: PMTime + "PM",
                          location: PMLocation,
                          date,
                          title,
                          price,
                          image: url,
                        },
                      });
                    setBTNLoading(false);
                    Alert.alert(
                      "Session added, a refresh may be needed to see change"
                    );
                  } else {
                    db.collection("calendar")
                      .doc(date)
                      .set({
                        [id]: {
                          id,
                          name,
                          time: PMTime + "PM",
                          location: PMLocation,
                          date,
                          title,
                          price,
                          image: url,
                        },
                      });
                    setBTNLoading(false);
                    Alert.alert(
                      "Session added, a refresh may be needed to see change"
                    );
                  }
                });
            });
        }
      );
    try {
      await ref;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={100}
      behavior="padding"
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.dc}>
          <Input
            value={date}
            onChangeText={(text) => setDate(text)}
            placeholder="Date in YYYY-MM-DD Format"
          />
          <Input
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Name (Without 'Coach')"
          />
          <Input
            value={title}
            onChangeText={(text) => setTitle(text)}
            placeholder="Event Name"
          />
          <Input
            value={price}
            onChangeText={(text) => setPrice(text)}
            placeholder="Event Price"
          />
          {image && (
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Image
                source={{ uri: image }}
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 10,
                }}
              />
            </View>
          )}
          {btnLoading === false && (
            <Button title={"Pick Event Image"} onPress={pickImage} />
          )}
          {btnLoading === true && (
            <Button raised disabled title="Loading . . ." />
          )}
        </View>
        <View style={styles.dc}>
          <Input
            value={AMTime}
            onChangeText={(text) => setAMTime(text)}
            placeholder="Time (AM) (Ex. 10:00-11:00)"
          />
          <Input
            value={AMLocation}
            onChangeText={(text) => setAMLocation(text)}
            placeholder="Location"
          />
          {btnLoading === false && (
            <Button onPress={addAMSession} title={"Add AM Session"} />
          )}
          {btnLoading === true && (
            <Button raised disabled title="Loading . . ." />
          )}
        </View>
        <View style={styles.dc}>
          <Input
            value={PMTime}
            onChangeText={(text) => setPMTime(text)}
            placeholder="Time (PM) (Ex. 10:00-11:00)"
          />
          <Input
            value={PMLocation}
            onChangeText={(text) => setPMLocation(text)}
            placeholder="Location"
          />
          {btnLoading === false && (
            <Button onPress={addPMSession} title={"Add PM Session"} />
          )}
          {btnLoading === true && (
            <Button raised disabled title="Loading . . ." />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Admin_Add_Session_Screen;

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
  dc: {
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "white",
    marginTop: 30,
  },
});
