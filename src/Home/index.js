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
      >
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
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.contentView}>
            <View style={styles.bottomView}>
              <DropDownPicker
                items={vehicles}
                defaultValue={carbon}
                containerStyle={{ width: "33.2%", height: 50 }}
                style={{ backgroundColor: "black" }}
                arrowStyle={{ backgroundColor: "white" }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                dropDownStyle={{ backgroundColor: "black" }}
                globalTextStyle={{ color: "white", fontSize: 16 }}
                onChangeItem={(item) => {
                  updateCarbon(item.value);
                  console.log(carbon);
                }}
              />
              <View style={styles.dialContainer}>
                <DialButton title="Carbon Impact" />
                <DialButton
                  title={"Distance: " + Math.round(distance * 100) / 100}
                  value={distance}
                />
                <DialButton
                  title={"Speed: " + Math.round(speed * 100) / 100}
                  value={speed}
                />
              </View>
              <View style={styles.startBttnView}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.buttonBox}
                  onPress={() => setStart((prev) => !prev)}
                >
                  <Text style={styles.buttonFont}>
                    {start ? "Start" : "Stop"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </MapView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  dialContainer: { flexDirection: "row" },
  buttonBox: {
    padding: 16,
    paddingLeft: 32,
    paddingRight: 32,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    marginTop: 8,
  },
  buttonFont: {
    color: "white",
    fontSize: 20,
  },
  startBttnView: {},
  contentView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomView: {
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    position: "absolute", //Here is the trick
    bottom: 0, //Here is the trick
    backgroundColor: "blue",
    //alignItems: "flex-end",
  },
});
