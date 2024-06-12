import "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { auth } from "../firebase";

const Loading_Screen = ({ navigation }) => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Landing_App");
      } else {
        navigation.replace("Landing_App");
      }
    });
    return unsubscribe;
  }, []);
  return (
    <View>
      <Text></Text>
    </View>
  );
};

export default Loading_Screen;

const styles = StyleSheet.create({});
