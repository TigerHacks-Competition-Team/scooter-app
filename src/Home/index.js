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
      <View style={styles.startBttn}>
        <TouchableOpacity
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
    bottom: 100,
    zIndex: 10,
    flex: 1,
    flexDirection: "row",
    marginHorizontal: 10,
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  buttonBox: {
    width: 120,
    height: 55,
    left: Dimensions.get("window").width / 2 - 60,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
  },
  buttonFont: {
    color: "white",
    fontSize: 20,
  },
  startBttn: {
    position: "absolute",
    bottom: "5%",
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
