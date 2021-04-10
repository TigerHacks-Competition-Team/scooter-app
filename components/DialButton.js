import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const DialButton = ({ title }) => {
  return (
    <TouchableOpacity style={styles.buttonBox} activeOpacity={0.8}>
      <Text style={{ color: "white", fontSize: 16 }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default DialButton;

const styles = StyleSheet.create({
  buttonBox: {
    width: "33.2%",
    height: 50,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 4,
    paddingHorizontal: 10,
  },
});
