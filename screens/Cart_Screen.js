import "react-native-gesture-handler";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { Button } from "react-native-elements";
import Cart_Item from "../components/Cart_Item.js";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { auth, db, firebase } from "../firebase.js";

const Cart_Screen = ({ navigation }) => {
  const [cartProducts, setCartProducts] = useState([]);
  const [displayPrice, setDisplayPrice] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [pPackages, setPPackages] = useState([]);
  const [pProducts, setPProducts] = useState([]);

  let finalPrice = 0;
  let IDNames = [];

  const clearCart = async () => {
    var colRef = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("cart");
    colRef.get().then((querySnapshot) => {
      Promise.all(querySnapshot.docs.map((d) => d.ref.delete()));
    });
  };

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setLoggedIn(true);
      get_order_count();
    } else {
      Alert.alert("Please Login or Sign up to Continue");
      navigation.navigate("Login_Screen");
    }
  }, []);

  useLayoutEffect(() => {
    if (auth.currentUser) {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .collection("cart")
        .onSnapshot((snapshot) => {
          setCartProducts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    }
  }, []);

  const get_order_count = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setOrderCount(snapshot.data().orderCount);
          setPPackages(snapshot.data().packages_ordered);
          setPProducts(snapshot.data().products_ordered);
        }
      });
  };

  useEffect(() => {
    if (auth.currentUser) {
      cartProducts.map(({ id, data }) => {
        finalPrice = finalPrice + data.price;
        IDNames.push(data.id);
      });
      setDisplayPrice(finalPrice);
    } else {
    }
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          }
        });
    }
  }, []);

  const API_URL = "https://server-3afc.onrender.com";
  // const API_URL = "http://localhost:3000";

  const sendEmail = async (data) => {
    console.log("called");
    cartProducts.map((p) => {});
    const response = await fetch(`${API_URL}/nodemail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Value:
          auth.currentUser.email +
          "_" +
          user.name +
          "_" +
          user.phoneNumber +
          "_ " +
          user.address,
      },
      body: JSON.stringify(
        cartProducts.map((cartProduct) => ({
          name: cartProduct.data.name,
          price: cartProduct.data.price,
          description: cartProduct.data.description,
          participantGrade: cartProduct.data.participantGrade,
          participantName: cartProduct.data.participantName,
          quantity: cartProduct.data.quantity,
          size: cartProduct.data.size,
          imageURL: cartProduct.data.imageURL,
          date: cartProduct.data.date,
          isIndividual: cartProduct.data.isIndividual,
          time: cartProduct.data.time,
          location: cartProduct.data.location,
          gradClass: cartProduct.data.gradClass,
          school: cartProduct.data.school,
          parentName: cartProduct.data.parentName,
          parentPhone: cartProduct.data.parentPhone,
          parentEmail: cartProduct.data.parentEmail,
          IGHandle: cartProduct.data.IGHandle,
          twitterHandle: cartProduct.data.twitterHandle,
          tiktokHandle: cartProduct.data.tiktokHandle,
        }))
      ),
    });
  };

  const stripe = useStripe();

  const [payLoading, setPayLoading] = useState(false);

  // change to exact payment amount not 2500
  // then update the server to send right name, right payment, and /nodemail functionality
  const pay = async () => {
    const name = auth.currentUser.displayName;
    try {
      // sending request
      setPayLoading(true);
      const response = await fetch(`${API_URL}/pay`, {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
          "Content-Type": "application/json",
          Value: parseFloat(displayPrice.toFixed(2)) * 100,
        },
      });
      const data = await response.json();
      if (!response.ok) return Alert.alert(data.message);
      setPayLoading(false);
      const clientSecret = data.clientSecret;
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
      });
      if (initSheet.error) return Alert.alert(initSheet.error.message);
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error) return Alert.alert(presentSheet.error.message);
      logOrder();
      Alert.alert(
        "Payment complete, thank you! Email confirmation sent, it may be in your spam."
      );
      clearCart();
      await sendEmail();
    } catch (err) {
      Alert.alert("Something went wrong, try again later!");
    }
  };

  const decrement = () => {
    cartProducts.map(({ id, data }) => {
      if (data.size != null) {
        if (data.size === "XS") {
          db.collection("products")
            .doc(data.id)
            .update({
              xsQ: firebase.firestore.FieldValue.increment(-1),
            });
        } else if (data.size === "S") {
          db.collection("products")
            .doc(data.id)
            .update({
              sQ: firebase.firestore.FieldValue.increment(-1),
            });
        } else if (data.size === "M") {
          db.collection("products")
            .doc(data.id)
            .update({
              mQ: firebase.firestore.FieldValue.increment(-1),
            });
        } else if (data.size === "L") {
          db.collection("products")
            .doc(data.id)
            .update({
              lQ: firebase.firestore.FieldValue.increment(-1),
            });
        } else if (data.size === "XL") {
          db.collection("products")
            .doc(data.id)
            .update({
              xlQ: firebase.firestore.FieldValue.increment(-1),
            });
        }
      }
    });
  };

  const logOrder = () => {
    newRef = db
      .collection("users")
      .doc(auth.currentUser.uid)
      .collection("orders")
      .doc("order" + (orderCount + 1).toString());

    get_order_count();
    current_order_count = orderCount + 1;
    db.collection("users").doc(auth.currentUser.uid).update({
      orderCount: current_order_count,
    });

    decrement();

    const packages_ordered = [];
    const products_ordered = [];

    cartProducts.map(({ id, data }) => {
      if (data.hasOwnProperty("date")) {
        newRef.collection(data.id).doc().set({
          productName: data.name,
          IGHandle: data.IGHandle,
          gradClass: data.gradClass,
          playerName: data.participantName,
          price: data.price,
          tiktokHandle: data.tiktokHandle,
          twitterHandle: data.twitterHandle,
          parentName: data.parentName,
          parentEmail: data.parentEmail,
          parentPhone: data.parentPhone,
          id: data.id,
          imageURL: data.imageURL,
          participantGrade: data.participantGrade,
        });
      } else if (data.hasOwnProperty("incrementPrice")) {
        newRef.collection(data.id).doc().set({
          productName: data.name,
          price: data.price,
          incrementPrice: data.incrementPrice,
          quantity: data.quantity,
          size: data.size,
          imageURL: data.imageURL,
          id: data.id,
        });
      } else if (data.hasOwnProperty("IGHandle")) {
        newRef.collection(data.id).doc().set({
          productName: data.name,
          IGHandle: data.IGHandle,
          gradClass: data.gradClass,
          playerName: data.participantName,
          price: data.price,
          tiktokHandle: data.tiktokHandle,
          twitterHandle: data.twitterHandle,
          parentName: data.parentName,
          parentEmail: data.parentEmail,
          parentPhone: data.parentPhone,
          id: data.id,
          imageURL: data.imageURL,
          participantGrade: data.participantGrade,
        });
      }
      // console.log(data);
      // if (data.hasOwnProperty("isIndividual")) {
      //   newRef.collection(data.id).doc().set({
      //     name: "bye",
      //     // id: data.id,
      //     // imageURL: data.imageURL,
      //     // price: data.price,
      //     // name: data.name,
      //     // time: data.time,
      //     // location: data.location,
      //     // date: data.date,
      //   });
      //   db.collection("calendar")
      //     .doc(data.date)
      //     .update({
      //       [data.id]: {
      //         id: data.id,
      //         name: data.name,
      //         time: data.time,
      //         location: data.location,
      //         date: data.date,
      //         title: data.title,
      //         image: data.image,
      //       },
      //     });
      //   // mark data.id as booked, look at account screen for how to update
      // } else {
      //   products_ordered.push(data.id);
      //   console.log("new " + data);
      //   newRef.collection(data.id).doc().set({
      //     productName: data.name,
      //     IGHandle: data.IGHandle,
      //     productDescription: data.description,
      //     gradClass: data.gradClass,
      //     playerName: data.participantName,
      //     price: data.price,
      //     quantity: data.quantity,
      //     tiktokHandle: data.tiktokHandle,
      //     twitterHandle: data.twitterHandle,
      //     parentName: data.parentName,
      //     parentEmail: data.parentEmail,
      //     parentPhone: data.parentPhone,
      //     id: data.id,
      //     imageURL: data.imageURL,
      //     participantGrade: data.participantGrade
      //     // id: data.id,
      //     // imageURL: data.imageURL,
      //     // price: data.incrementPrice,
      //     // name: data.name,
      //     // size: data.size,
      //     // quantity: data.quantity,
      //   });
      // }
      // // try package first, then do regular product
    });

    newRef = db.collection("users").doc(auth.currentUser.uid);
    newRef.update({
      email: auth.currentUser.email,
      name: auth.currentUser.displayName,
    });
  };

  return (
    <View style={styles.container}>
      <StripeProvider publishableKey="pk_live_51POkfkJxYcGeGjpgjEcc8fL8I3SlooAv7OZR5NQvPifdBJDak0bRu7CfdesJXCMC9AE4w6nTgQwpFVKlKGrGgZGy00odkXSWS7">
        {cartProducts.length < 1 && (
          <View
            style={{
              justifyContent: "center",
              alignSelf: "center",
              height: "100%",
            }}
          >
            {loggedIn && <Text>Nothing in Your Cart Right Now</Text>}
            {!loggedIn && (
              <Button
                style={{ width: 200 }}
                title={"Login to Access Cart"}
                onPress={() => navigation.navigate("Login_Screen")}
              ></Button>
            )}
          </View>
        )}
        {cartProducts.length > 0 && (
          <View styles={styles.itemsContainer}>
            <ScrollView
              style={{ height: "100%" }}
              showsVerticalScrollIndicator={false}
            >
              {cartProducts.map(({ id, data }) => {
                return <Cart_Item key={id} data={data} id={id} />;
              })}
              <View style={{ height: 50 }}></View>
            </ScrollView>
          </View>
        )}

        {cartProducts.length > 0 && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
            }}
          >
            {payLoading === false && (
              <Button
                onPress={pay}
                style={styles.button}
                title={"Check Out - $" + parseFloat(displayPrice.toFixed(2))}
              />
            )}
            {payLoading === true && (
              <Button
                raised
                disabled
                containerStyle={styles.button}
                title="Loading . . ."
              />
            )}
          </View>
        )}
      </StripeProvider>
    </View>
  );
};

export default Cart_Screen;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  itemsContainer: {
    backgroundColor: "red",
  },
  button: {
    marginHorizontal: 40,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});
