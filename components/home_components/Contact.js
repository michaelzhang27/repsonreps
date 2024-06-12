import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";

const Contact = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Contact</Text>
      <View style={styles.card}>
        <View style={styles.left}>
          <Image
            source={require("../../assets/app_images/contact.jpg")}
            style={{ height: 155, width: 155, borderRadius: 20 }}
          />
        </View>
        <View style={styles.right}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ width: "90%" }}
          >
            <Text numberOfLines={1} style={styles.title}>
              Mark Dixon
            </Text>
          </ScrollView>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ width: "90%" }}
          >
            <Text numberOfLines={1} style={styles.number}>
              904-703-3377
            </Text>
          </ScrollView>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ width: "90%" }}
          >
            <Text numberOfLines={1} style={styles.title}>
              Nick Blocker
            </Text>
          </ScrollView>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ width: "90%" }}
          >
            <Text numberOfLines={1} style={styles.number}>
              904-755-6454
            </Text>
          </ScrollView>
        </View>
      </View>

      <View style={{ height: 60 }}></View>
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
  },
  label: {
    fontSize: 32,
    fontWeight: 500,
    marginLeft: 20,
  },
  card: {
    flexDirection: "row",
    marginTop: 15,
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
    padding: 10,
  },
  left: {
    alignSelf: "center",
    marginLeft: 7,
  },
  right: {
    marginLeft: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: Dimensions.get("screen").width * 0.04,
    fontWeight: "bold",
  },
  number: {
    fontSize: Dimensions.get("screen").width * 0.04,
    fontWeight: 300,
  },
});
