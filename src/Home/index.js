import React, { useEffect, useState } from "react";
import { getLocation } from "../../Hooks/index";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FloatingView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import MapView from "react-native-maps";
import DialButton from "../../components/DialButton";
import { Marker } from "react-native-maps";
import WaypointList from "../../Objects/WaypointList";
import Waypoint from "../../Objects/Waypoint";

const vehicles = [
  { label: "Car", value: 0.00411 },
  { label: "Scooter", value: 0.002 },
  { label: "Walking", value: 0.00014 },
];

const Home = () => {
  const [start, setStart] = useState(true);
  const [location] = getLocation();
  const [carbon, updateCarbon] = useState(vehicles[0].value);
  const [waypoints, updateWayPoints] = useState([]);
  const [distance, updateDistance] = useState(0);
  const [carbonEmmitted, setcarbonEmiited] = useState(0);

  useEffect(() => {
    setcarbonEmiited(distance * carbon);
    console.log("Carbon Emitted", carbonEmmitted);
  }, [distance]);

  React.useEffect(() => {
    if (!start && location && location.coords) {
      updateWayPoints((prev) => {
        let pts = new WaypointList(prev ? prev : []);
        pts.addWayPoint(new Waypoint(location));
        console.log("adding waypoint");
        return pts.waypoints;
      });
    }
  }, [location, start]);

  React.useEffect(() => {
    let list = new WaypointList(waypoints);
    updateDistance(list.calcTotalDistance());
  }, [waypoints]);

  return (
    <View style={{ flex: 1 }}>
      <View>
        <MapView
          style={styles.map}
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
        </MapView>
      </View>
      <View style={styles.dialContainer}>
        <DialButton title="Carbon Impact" />
        <Text>{Math.round(distance * 100) / 100}</Text>
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
