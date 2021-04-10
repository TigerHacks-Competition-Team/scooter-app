import React from "react";
import { View, Text, StyleSheet } from "react-native";
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
    marginBottom: 50,
  },
});
