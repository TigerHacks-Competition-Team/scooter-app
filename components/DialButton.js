import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

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
    width: Dimensions.get("window").width / 3 - 16 - 6,
    flexGrow: 1,
    flexShrink: 0,
    height: 50,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 4,
    margin: 8,
  },
});
