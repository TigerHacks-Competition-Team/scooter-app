import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DialButton from "../../components/DialButton";

const Home = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text>Home</Text>
      <View style={styles.dialContainer}>
        <DialButton title="Carbon Impact" />
        <DialButton title="Distance" />
        <DialButton title="Something" />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-around",
          marginBottom: "20%",
          marginTop: 10,
          marginHorizontal: 40,
        }}
      >
        <TouchableOpacity style={styles.buttonBox}>
          <Text style={{ color: "white" }}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonBox}>
          <Text style={{ color: "white" }}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  dialContainer: {
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 10,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  buttonBox: {
    width: "40%",
    height: 60,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
  },
});
