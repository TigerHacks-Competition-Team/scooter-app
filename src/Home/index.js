import React, { useState } from "react";
import { getLocation } from "../../Hooks/index";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FloatingView,
  SafeAreaView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import MapView from "react-native-maps";
import DialButton from "../../components/DialButton";
import { Marker } from "react-native-maps";
import WaypointList from "../../Objects/WaypointList";
import Waypoint from "../../Objects/Waypoint";

const vehicles = [
  { label: "Car", value: 200 },
  { label: "Scooter", value: 100 },
  { label: "Walking", value: 3 },
];

const Home = () => {
  const [start, setStart] = useState(true);
  const [location] = getLocation();
  const [carbon, updateCarbon] = useState(vehicles[0].value);
  const [waypoints, updateWayPoints] = useState([]);
  const [distance, updateDistance] = useState(0);
  const [speed, updateSpeed] = useState(0);
  const [startTime, setStartTime] = useState(0);

  React.useEffect(() => {
    if (!start && location && location.coords) {
      updateWayPoints((prev) => {
        let pts = new WaypointList(prev ? [...prev] : []);
        pts.addWayPoint(new Waypoint(location));
        console.log("adding waypoint");
        return pts.waypoints;
      });
    }
  }, [location, start]);

  React.useEffect(() => {
    if (!start) {
      setStartTime(new Date());
    }
  }, [start]);

  React.useEffect(() => {
    let list = new WaypointList(waypoints);
    const dist = list.calcTotalDistance();
    updateDistance(dist);
    updateSpeed(list.calcSpeed(dist, new Date() - startTime));
  }, [waypoints]);

  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={
          location && location.coords
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
              }
            : null
        }
        region={
          location && location.coords
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
              }
            : null
        }
      />
      {location && location.coords && (
        <Marker
          coordinate={{
            latitude:
              location && location.coords ? location.coords.latitude : 0,
            longitude:
              location && location.coords ? location.coords.longitude : 0,
          }}
        />
      )}
      <DropDownPicker
        items={vehicles}
        defaultValue={carbon}
        containerStyle={{ width: "33.2%", height: 50 }}
        style={{
          backgroundColor: "black",
          position: "absolute",
          top: 40,
          right: -270,
          width: 130,
        }}
        arrowStyle={{ backgroundColor: "white" }}
        itemStyle={{
          justifyContent: "flex-start",
        }}
        dropDownStyle={{
          backgroundColor: "black",
          position: "absolute",
          right: -270,
          width: 130,
        }}
        globalTextStyle={{ color: "white", fontSize: 16 }}
        onChangeItem={(item) => {
          updateCarbon(item.value);
          console.log(carbon);
        }}
      />
      <View style={styles.dialContainer}>
        <DialButton title="Carbon Impact" />
        <DialButton title={"Distance: " + Math.round(distance * 100) / 100} />
        <DialButton title={"Speed: " + Math.round(speed * 100) / 100} />
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.startBttnView}
        onPress={() => setStart((prev) => !prev)}
      >
        <Text style={{ color: "white", fontSize: 20 }}>
          {start ? "Start" : "Stop"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  dialContainer: {
    position: "absolute",
    bottom: 10,
    height: 200,
    flexDirection: "row",
    marginLeft: 1.5,
  },
  startBttnView: {
    position: "absolute",
    bottom: 80,
    left: Dimensions.get("window").width / 2 - 125 / 2,
    width: 125,
    height: 60,
    backgroundColor: "blue",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
