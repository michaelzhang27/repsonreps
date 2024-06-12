import "react-native-gesture-handler";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Button, Input } from "react-native-elements";
import { db, auth, firebase } from "../firebase.js";
import { useNavigation } from "@react-navigation/native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const Product_Info_Screen = ({ route }) => {
  let data = route.params.data;
  let id = route.params.id;

  const navigation = useNavigation();

  const [size, setSize] = useState(null);

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      console.log("yes");
      setLoggedIn(true);
    }
  }, []);

  const checkIfOK = async () => {
    db.collection("products")
      .doc(id)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          if (snapshot.data().sQ != null) {
            if (size === "XS" && snapshot.data().xsQ === 0) {
              Alert.alert("Sorry! This size is sold out!");
            } else if (size === "S" && snapshot.data().sQ === 0) {
              Alert.alert("Sorry! This size is sold out!");
            } else if (size === "M" && snapshot.data().mQ === 0) {
              Alert.alert("Sorry! This size is sold out!");
            } else if (size === "L" && snapshot.data().lQ === 0) {
              Alert.alert("Sorry! This size is sold out!");
            } else if (size === "XL" && snapshot.data().xlQ === 0) {
              Alert.alert("Sorry! This size is sold out!");
            } else {
              addToCart();
            }
          } else {
            addToCart();
          }
        }
      });
  };

  const addToCart = () => {
    if (
      ((data.shirtSizeIsChecked || data.shortSizeIsChecked) &&
        (size === "XS" ||
          size === "S" ||
          size === "M" ||
          size === "L" ||
          size === "XL")) ||
      (!data.shirtSizeIsChecked && !data.shortSizeIsChecked)
    ) {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .collection("cart")
        .doc()
        .set({
          imageURL: data.productImageURL,
          price: parseFloat(data.productPrice),
          incrementPrice: parseFloat(data.productPrice),
          name: data.productName,
          size,
          quantity: 1,
          id,
        });
      setSize("");
      navigation.goBack();
      Alert.alert("Item Added to Cart");
    } else {
      Alert.alert("Please Enter Your Size - 'XS', 'S', 'M', 'L', or 'XL' ");
    }
  };

  const [loading, setLoading] = useState(true);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {loading && (
          <View>
            <ShimmerPlaceholder
              style={{
                position: "absolute",
                height: 300,
                width: 300,
                margin: 5,
                borderRadius: 20,
              }}
            />
          </View>
        )}
        <Image
          style={styles.productImage}
          source={{ uri: data.productImageURL }}
          onLoadEnd={() => setLoading(false)}
        />
        <View style={styles.text}>
          <Text style={styles.productName}>{data.productName}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.productPrice}>${data.productPrice}</Text>
            {!data.shirtSizeIsChecked && !data.shortSizeIsChecked && (
              <View style={{}}>
                <Text style={styles.productPrice}> - One Size Fits All</Text>
              </View>
            )}
          </View>
        </View>
        {(data.shirtSizeIsChecked || data.shortSizeIsChecked) && (
          <View>
            <View style={{ height: 20 }}></View>
            <View style={{ marginHorizontal: 20 }}>
              <Input
                value={size}
                onChangeText={(text) => setSize(text)}
                placeholder="Enter a Size: 'XS', 'S', 'M', 'L', 'XL' "
              />
            </View>
          </View>
        )}
        {loggedIn && (
          <Button
            title="Add to Cart"
            style={{ paddingTop: 40, width: 300, alignSelf: "center" }}
            onPress={checkIfOK}
          />
        )}
        {!loggedIn && (
          <Button
            title="Add to Cart"
            style={{ paddingTop: 40, width: 300, alignSelf: "center" }}
            onPress={() => {
              Alert.alert("Please Sign in or Register to Continue");
              navigation.navigate("Login_Screen");
            }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Product_Info_Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    width: 400,
    alignSelf: "center",
    alignItems: "center",
  },
  productImage: {
    height: 300,
    width: 300,
    borderRadius: 20,
    alignSelf: "center",
  },
  text: {
    marginTop: 15,
    marginHorizontal: 20,
  },
  productName: {
    fontSize: 30,
    fontWeight: "bold",
  },
  productPrice: {
    fontWeight: 200,
    fontSize: 20,
    paddingTop: 5,
  },
});
