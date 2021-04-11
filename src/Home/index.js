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
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import DialButton from "../../components/DialButton";
import { Marker } from "react-native-maps";
import WaypointList from "../../Objects/WaypointList";
import Waypoint from "../../Objects/Waypoint";
import { MaterialIcons } from "@expo/vector-icons";

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
  const [carbonEmit, updateCarbonEmit] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [secs, setSecs] = useState(0);

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
    const timeout = setTimeout(() => {
      if (!start) {
        setSecs(secs + 1);
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [secs, start]);

  React.useEffect(() => {
    if (!start) {
      updateWayPoints([]);
    }
  }, [start]);

  React.useEffect(() => {
    if (waypoints.length > 0) {
      let list = new WaypointList(waypoints);
      const dist = list.calcTotalDistance();
      updateDistance(dist);
      console.log(
        "Time: " + (waypoints[waypoints.length - 1].time - waypoints[0].time)
      );
      updateSpeed(
        list.calcSpeed(
          dist,
          waypoints[waypoints.length - 1].time - waypoints[0].time
        )
      );
      updateCarbonEmit(list.calcCarbon(dist, carbon));
    } else {
      updateDistance(0);
      updateSpeed(0);
      updateCarbonEmit(0);
    }
  }, [waypoints, carbon]);

  const pad = (num) => (num < 10 ? "0" + num : num);

  const formatTime = (totalSeconds) => {
    const hours = pad(Math.floor(totalSeconds / 3600));
    const minutes = pad(Math.floor(totalSeconds / 60));
    const seconds = pad(totalSeconds % 60);
    if (totalSeconds >= 3600) {
      return `${hours}:${minutes}:${seconds}`;
    }
    return `  ${minutes}:${seconds}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        customMapStyle={customMapStyles}
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
        {waypoints.length > 0 && (
          <Polyline
            coordinates={new WaypointList(waypoints).toLineCoordinates()}
            strokeColor="#000"
          />
        )}
      </MapView>
      <DropDownPicker
        items={vehicles}
        defaultValue={carbon}
        searchable
        containerStyle={{ width: "50%", height: 50 }}
        style={{
          backgroundColor: "black",
          position: "absolute",
          top: 40,
          right:
            -(
              Dimensions.get("window").width -
              Dimensions.get("window").width / 2
            ) / 2,
          width: "100%",
          border: "none",
        }}
        arrowStyle={{ arrowColor: "white" }}
        arrowColor="white"
        itemStyle={{
          justifyContent: "flex-start",
        }}
        dropDownStyle={{
          backgroundColor: "black",
          right:
            -(
              Dimensions.get("window").width -
              Dimensions.get("window").width / 2
            ) / 2,
          width: "100%",
          marginTop: 40,
          border: "none",
        }}
        globalTextStyle={{ color: "white", fontSize: 16 }}
        onChangeItem={(item) => {
          updateCarbon(item.value);
          console.log(carbon);
        }}
      />
      <View style={styles.clockView}>
        <Text style={{ color: "white" }}>{formatTime(secs)}</Text>
      </View>
      <View style={styles.dialContainer}>
        <DialButton
          title={Math.round(carbonEmit * 100) / 100 + " grams"}
          style={{ border: "none", outline: "none" }}
        />
        <DialButton title={Math.round(distance * 100) / 100 + " miles"} />
        <DialButton title={Math.round(speed * 100) / 100 + " mph"} />
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
      <TouchableOpacity
        activeOpacity={0.4}
        style={{
          position: "absolute",
          bottom: 90,
          left: Dimensions.get("window").width * (5 / 6) - 20,
          width: 125,
        }}
        onPress={() => {}}
      >
        <MaterialIcons name="history" size={50} color="white" />
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
    margin: 8,
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
  clockView: {
    position: "absolute",
    bottom: 95,
    height: 30,
    left: 16,
  },
});

const customMapStyles = [
  {
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "administrative",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#bdbdbd",
      },
    ],
  },
  {
    featureType: "landscape",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "landscape.man_made",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "poi",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#181818",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#1b1b1b",
      },
    ],
  },
  {
    featureType: "road",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8a8a8a",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#373737",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#3c3c3c",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#4e4e4e",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "transit",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#3d3d3d",
      },
    ],
  },
];
