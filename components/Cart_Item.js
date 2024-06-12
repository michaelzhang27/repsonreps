import "react-native-gesture-handler";
import {
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { auth, db, firebase } from "../firebase.js";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const Cart_Item = ({ data, id }) => {
  const navigation = useNavigation();

  const remove = () => {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("cart")
      .doc(id)
      .delete();
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        cartCount: firebase.firestore.FieldValue.increment(-data.quantity),
      });
  };

  const minus = () => {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        cartCount: firebase.firestore.FieldValue.increment(-1),
      });

    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("cart")
      .doc(id)
      .update({
        quantity: firebase.firestore.FieldValue.increment(-1),
        price: data.price - data.incrementPrice,
      });
  };

  const add = () => {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        cartCount: firebase.firestore.FieldValue.increment(1),
      });

    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("cart")
      .doc(id)
      .update({
        quantity: firebase.firestore.FieldValue.increment(1),
        price: data.price + data.incrementPrice,
      });
  };

  useEffect(() => {
    if (data.quantity < 1) {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .collection("cart")
        .doc(id)
        .delete();
      db.collection("users")
        .doc(auth.currentUser.uid)
        .update({
          cartCount: firebase.firestore.FieldValue.increment(-1),
        });
    }
  });

  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      {loading && (
        <View>
          <ShimmerPlaceholder
            style={{
              position: "absolute",
              height: Dimensions.get("screen").height * 0.17,
              width: Dimensions.get("screen").height * 0.17,
              margin: 5,
              borderRadius: 20,
            }}
          />
        </View>
      )}
      <View style={styles.left}>
        <Image
          source={{ uri: data.imageURL }}
          style={{ height: 150, width: 150, borderRadius: 10 }}
          onLoadEnd={() => setLoading(false)}
        />
      </View>

      <View style={styles.right}>
        <View>
          <ScrollView
            style={{
              width: 160,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <Text style={styles.title} numberOfLines={1}>
              {data.isIndividual && data.title}
              {!data.isIndividual && data.name}
            </Text>
          </ScrollView>
        </View>
        <View style={styles.elem}>
          <Text style={styles.price}>${parseFloat(data.price).toFixed(2)}</Text>
        </View>
        <View style={styles.elem}>
          {data.name && (
            <ScrollView
              style={{
                width: 155,
              }}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
            >
              {data.participantName && (
                <Text numberOfLines={1} style={styles.info}>
                  Name: {data.participantName},
                  <View style={{ width: 4 }}></View>
                </Text>
              )}
              {data.participantGrade && (
                <Text numberOfLines={1} style={styles.info}>
                  Grade: {data.participantGrade}
                  {","}
                  <View style={{ width: 4 }}></View>
                </Text>
              )}
              {data.jerseySize && (
                <Text numberOfLines={1} style={styles.info}>
                  Jersey Size: {data.jerseySize},
                  <View style={{ width: 4 }}></View>
                </Text>
              )}
              {data.jerseyShortSize && (
                <Text numberOfLines={1} style={styles.info}>
                  Jersey Short Size: {data.jerseyShortSize},
                  <View style={{ width: 4 }}></View>
                </Text>
              )}
              {data.shirtSize && (
                <Text numberOfLines={1} style={styles.info}>
                  Shirt Size: {data.shirtSize},
                  <View style={{ width: 4 }}></View>
                </Text>
              )}
              {data.shortSize && (
                <Text numberOfLines={1} style={styles.info}>
                  Short Size: {data.shortSize}
                  <View style={{ width: 4 }}></View>
                </Text>
              )}
            </ScrollView>
          )}
          {data.size && (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ width: 150 }}
            >
              <Text style={styles.info}>Size: {data.size}</Text>
            </ScrollView>
          )}

          {!data.size && !data.participantName && !data.isIndividual && (
            <Text style={styles.info}>One Size Fits All</Text>
          )}
        </View>
        {data.parentName && (
          <View style={styles.elem}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{ width: 150 }}
            >
              <Text style={{ fontSize: 16 }}>
                Grad Class: {data.gradClass}, School: {data.school}, Parent
                Name: {data.parentName}, Parent Phone: {data.parentPhone},
                Parent Email: {data.parentEmail}, IG: {data.IGHandle}, Twitter:{" "}
                {data.twitterHandle}, TikTok: {data.tiktokHandle}
              </Text>
            </ScrollView>
          </View>
        )}
        <View style={styles.elem}>
          {!data.participantName && !data.isIndividual && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Pressable onPress={minus}>
                <Feather name="minus-circle" size={20} color="black" />
              </Pressable>
              <Text style={{ marginLeft: 10, fontSize: 18 }}>
                {data.quantity}
              </Text>
              <Pressable onPress={add} style={{ marginLeft: 10 }}>
                <Feather name="plus-circle" size={20} color="black" />
              </Pressable>
            </View>
          )}
        </View>
        <Pressable
          onPress={remove}
          style={{
            position: "absolute",
            bottom: 13,
            right: 5,
          }}
        >
          <Feather name="trash-2" size={15} color="#ff595e" />
        </Pressable>
      </View>
    </View>
  );
};

export default Cart_Item;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 15,
    backgroundColor: "white",
    height: Dimensions.get("screen").height * 0.22,
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
  },
  left: {
    alignSelf: "center",
    marginLeft: 15,
  },
  right: {
    width: "50%",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: Dimensions.get("screen").height * 0.02,
    fontWeight: "bold",
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: 300,
  },
  firstInfo: {
    fontSize: 16,
    fontWeight: 300,
  },
  info: {
    fontSize: 16,
    fontWeight: 300,
  },
  elem: {
    marginTop: 10,
  },
});
