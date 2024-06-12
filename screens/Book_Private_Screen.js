import "react-native-gesture-handler";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Input } from "react-native-elements";
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase.js";

const Book_Private_Screen = ({ route }) => {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [gradClass, setGradClass] = useState("");
  const [school, setSchool] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [IGHandle, setIGHandle] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [tiktokHandle, setTikTokHandle] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setLoggedIn(true);
    } else {
    }
  }, []);

  const data = route.params;

  console.log(data);

  const addToCart = () => {
    if (
      !name ||
      !grade ||
      !gradClass ||
      !school ||
      !parentName ||
      !parentPhone ||
      !parentEmail
    ) {
      Alert.alert("Please Fill Out All Information");
      return;
    }

    if (data.jerseyShortSizeIsChecked === true && jerseyShortSize === "") {
      Alert.alert("Please Fill Out All Information");
      return;
    }

    if (data.jerseySizeIsChecked === true && jerseySize === "") {
      Alert.alert("Please Fill Out All Information");
      return;
    }

    if (data.shirtSize === true && shirtSize === "") {
      Alert.alert("Please Fill Out All Information");
      return;
    }

    if (data.shortSize === true && shortSize === "") {
      Alert.alert("Please Fill Out All Information");
      return;
    }

    if (
      data.shortSizeIsChecked &&
      shortSize != "XS" &&
      shortSize != "S" &&
      shortSize != "M" &&
      shortSize != "L" &&
      shortSize != "XL"
    ) {
      Alert.alert("Please Enter Your Size - 'XS', 'S', 'M', 'L', or 'XL' ");
      return;
    } else if (
      data.shirtSizeIsChecked &&
      shirtSize != "XS" &&
      shirtSize != "S" &&
      shirtSize != "M" &&
      shirtSize != "L" &&
      shirtSize != "XL"
    ) {
      Alert.alert("Please Enter Your Size - 'XS', 'S', 'M', 'L', or 'XL' ");
      return;
    } else if (
      data.jerseySize &&
      jerseySize != "XS" &&
      jerseySize != "S" &&
      jerseySize != "M" &&
      jerseySize != "L" &&
      jerseySize != "XL"
    ) {
      Alert.alert("Please Enter Your Size - 'XS', 'S', 'M', 'L', or 'XL' ");
      return;
    } else if (
      data.jerseyShortSize &&
      jerseyShortSize != "XS" &&
      jerseyShortSize != "S" &&
      jerseyShortSize != "M" &&
      jerseyShortSize != "L" &&
      jerseyShortSize != "XL"
    ) {
      Alert.alert("Please Enter Your Size - 'XS', 'S', 'M', 'L', or 'XL' ");
      return;
    }

    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("cart")
      .doc()
      .set({
        id: data.id,
        date: data.date,
        name: data.title,
        participantName: name,
        time: data.time,
        imageURL: data.imageURL,
        price: parseFloat(data.price),
        imageURL: data.image,
        participantGrade: grade,
        gradClass,
        school,
        parentName,
        parentPhone,
        parentEmail,
        IGHandle,
        twitterHandle,
        tiktokHandle,
      });

    Alert.alert("Added to Cart: Check Out to Confirm Your Spot!");
    setName("");
    setGrade("");
    setGradClass("");
    setSchool("");
    setParentName("");
    setParentEmail("");
    setParentPhone("");
    setIGHandle("");
    setTwitterHandle("");
    setTikTokHandle("");
  };
  // const addToCart = async () => {
  //   db.collection("calendar")
  //     .doc(data.date)
  //     .get()
  //     .then((snapshot) => {
  //       if (snapshot.exists) {
  //         db.collection("users")
  //           .doc(auth.currentUser.uid)
  //           .collection("cart")
  //           .doc()
  //           .set({
  //             date: data.date,
  //             name: data.name,
  //             time: data.time,
  //             price: parseFloat(data.price),
  //             location: data.location,
  //             id: data.id,
  //             imageURL: data.image,
  //             title: data.title,
  //           });
  //         Alert.alert("Added to Cart: Check Out to Confirm Your Spot!");
  //       }
  //     });
  //   // add to cart, add a special param called isIndividual and set to true
  //   // figure out how to update booked, look at account edit screen
  // };

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={100}
      enabled
      behavior="padding"
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.ic}>
          <Image
            source={{
              uri: data.image,
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.dc}>
          <Text style={{ fontWeight: "800", fontSize: 25 }}>{data.title}</Text>
          <View style={{ marginTop: 20 }}>
            <Text style={{ marginRight: 10, fontSize: 18 }}>
              Date: {data.date}
            </Text>
            <Text style={{ fontSize: 18 }}>Time: {data.time}</Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ fontSize: 15, marginRight: 8 }}>
              {data.location}
            </Text>
            <View style={styles.verticalLine}></View>
            <Text style={{ fontSize: 15, marginLeft: 8 }}>${data.price}</Text>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={{ height: 20 }}></View>
          <Input
            placeholder="Participant Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <Input
            placeholder="Participant Grade Level"
            value={grade}
            onChangeText={(text) => setGrade(text)}
          />
          <Input
            placeholder="Graduation Class"
            value={gradClass}
            onChangeText={(text) => setGradClass(text)}
          />
          <Input
            placeholder="School"
            value={school}
            onChangeText={(text) => setSchool(text)}
          />
          <Input
            placeholder="Parent/Guardian Name"
            value={parentName}
            onChangeText={(text) => setParentName(text)}
          />
          <Input
            placeholder="Parent/Guardian Phone #"
            value={parentPhone}
            onChangeText={(text) => setParentPhone(text)}
          />
          <Input
            placeholder="Parent/Guardian Email"
            value={parentEmail}
            onChangeText={(text) => setParentEmail(text)}
          />
          <Input
            placeholder="IG Handle (optional)"
            value={IGHandle}
            onChangeText={(text) => setIGHandle(text)}
          />
          <Input
            placeholder="Twitter Handle (optional)"
            value={twitterHandle}
            onChangeText={(text) => setTwitterHandle(text)}
          />
          <Input
            placeholder="TikTok Handle (optional)"
            value={tiktokHandle}
            onChangeText={(text) => setTikTokHandle(text)}
          />
          {loggedIn && (
            <Button
              style={styles.button}
              title="Add To Cart"
              onPress={addToCart}
            />
          )}
          {!loggedIn && (
            <Button
              style={styles.button}
              title="Add To Cart"
              onPress={() => {
                Alert.alert("Please Sign in or Register to Continue");
                navigation.navigate("Login_Screen");
              }}
            />
          )}
          <View style={{ height: 20 }}></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Book_Private_Screen;

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
  dc: {
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "white",
  },
  verticalLine: {
    height: "100%",
    width: 1,
    backgroundColor: "#909090",
  },
  inputContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "white",
    width: "95%",
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
    marginBottom: 30,
  },
});
