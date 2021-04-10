import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FloatingView,
} from "react-native";
import MapView from "react-native-maps";
import DialButton from "../../components/DialButton";

const Home = () => {
  const [start, setStart] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <View>
        <MapView style={styles.map} />
      </View>
      <View style={styles.dialContainer}>
        <DialButton title="Carbon Impact" />
        <DialButton title="Distance" />
        <DialButton title="Something" />
      </View>
      <View style={styles.startBttnView}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.buttonBox}
          onPress={() => setStart(!start)}
        >
          <Text style={styles.buttonFont}>{start ? "Start" : "Stop"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  dialContainer: {
    position: "absolute",
    bottom: 95,
    zIndex: 10,
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 10,
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  buttonBox: {
    width: 120,
    height: 50,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 10,
  },
  buttonFont: {
    color: "white",
    fontSize: 20,
  },
  startBttnView: {
    position: "absolute",
    bottom: "5%",
    left: Dimensions.get("window").width / 2 - 60,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
