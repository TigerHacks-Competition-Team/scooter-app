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
  Modal,
  Keyboard,
  FlatList,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import DialButton from "../../components/DialButton";
import { Marker } from "react-native-maps";
import WaypointList from "../../Objects/WaypointList";
import Waypoint from "../../Objects/Waypoint";
import { MaterialIcons } from "@expo/vector-icons";

const vehicles = [
  { label: "Car", value: 204 },
  { label: "Rental eScooter", value: 124 },
  { label: "Electric Skateboard", value: 3 },
  { label: "Motorcycle", value: 86 },
  { label: "Electric Car", value: 78 },
  { label: "Average Bus", value: 180 },
  { label: "Full Bus", value: 51 },
  { label: "Bike", value: 0 },
  { label: "Walking", value: 0 },
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
  const [routes, setRoutes] = useState([]);
  const [secs, setSecs] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  React.useEffect(() => {
    getLists();
  }, []);

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
    } else if (start && waypoints.length > 1) {
      let way = new WaypointList(waypoints);
      way.saveList();
      getLists();
    }
  }, [start]);

  React.useEffect(() => {
    if (waypoints.length > 0) {
      let list = new WaypointList(waypoints);
      const dist = list.calcTotalDistance();
      const time = waypoints[waypoints.length - 1].time - waypoints[0].time;
      updateDistance(dist);
      console.log("Time: " + time);
      if (time > 0) {
        updateSpeed(list.calcSpeed(dist, time));
      }

      updateCarbonEmit(list.calcCarbon(dist, carbon));
    } else {
      updateDistance(0);
      updateSpeed(0);
      updateCarbonEmit(0);
    }
  }, [waypoints, carbon]);

  const getLists = async () => {
    let lists = await WaypointList.getAllLists();
    for (let i = 0; i < lists.length; i++) {
      lists[i].waypoints = lists[i].waypoints.map(
        (point) => new Waypoint(point)
      );
    }
    console.log("loading waypoints");
    setRoutes(lists);
  };
  const pad = (num) => (num < 10 ? "0" + num : num);

  const formatTime = (totalSeconds) => {
    const hours = pad(Math.floor(totalSeconds / 3600));
    const minutes = pad(Math.floor(totalSeconds / 60));
    const seconds = pad(totalSeconds % 60);
    if (totalSeconds >= 3600) {
      return `${hours}:${minutes}`;
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
            strokeColor="blue"
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
        onClose={() => Keyboard.dismiss()}
      />
      <View style={styles.clockView}>
        <Text
          style={{
            color: "white",
            fontSize: 24,
            position: "relative",
            left: "-5%",
          }}
        >
          {formatTime(secs)}
        </Text>
      </View>
      <View style={styles.dialContainer}>
        <DialButton
          title={
            carbonEmit < 1000
              ? Math.round(carbonEmit * 100) / 100 + " grams"
              : Math.round((carbonEmit / 1000) * 100) / 100 + " kg"
          }
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
        style={styles.historyView}
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <MaterialIcons name="history" size={50} color="white" />
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent={true}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={styles.modalView}>
            <View style={styles.modalTitle}>
              <Text style={{ fontSize: 24 }}>Past Routes</Text>
            </View>
            <View style={styles.modalList}>
              <FlatList
                data={routes.filter((x) => x.waypoints.length > 1)}
                keyExtractor={(item) => item.index}
                renderItem={({ item }) => {
                  const dist = item.calcTotalDistance();
                  const time =
                    item.waypoints[item.waypoints.length - 1].time -
                    item.waypoints[0].time;
                  let h, m, s;
                  h = Math.floor(time / 1000 / 60 / 60);
                  m = Math.floor((time / 1000 / 60 / 60 - h) * 60);
                  s = Math.floor(((time / 1000 / 60 / 60 - h) * 60 - m) * 60);
                  s < 10 ? (s = `0${s}`) : (s = `${s}`);
                  m < 10 ? (m = `0${m}`) : (m = `${m}`);
                  h < 10 ? (h = `0${h}`) : (h = `${h}`);
                  let bounds = item.getBounds();
                  const c = item.calcCarbon(dist, carbon);
                  return (
                    <View style={{ marginBottom: 5 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          margin: 8,
                          alignItems: "center",
                        }}
                      >
                        <View>
                          <Text>{`${Math.round(dist * 100) / 100} miles`}</Text>
                          <Text>{`${
                            Math.round(item.calcSpeed(dist, time) * 100) / 100
                          } mph`}</Text>
                          <Text>{`${Math.round(c * 100) / 100} grams`}</Text>
                          <Text>{`${h}:${m}:${s}`}</Text>
                        </View>
                        <MapView
                          style={{ height: 100, width: 100 }}
                          region={{
                            longitude: bounds.long,
                            latitude: bounds.lat,
                            latitudeDelta: bounds.deltaLat,
                            longitudeDelta: bounds.deltaLong,
                          }}
                          customMapStyle={customMapStyles}
                          provider={PROVIDER_GOOGLE}
                        >
                          <Polyline
                            coordinates={item.toLineCoordinates()}
                            strokeColor="blue"
                          />
                        </MapView>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
            <View style={{ justifyContent: "flex-end", marginLeft: 10 }}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <MaterialIcons
                  name="keyboard-backspace"
                  size={60}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    bottom: 95,
    height: 40,
    left: Dimensions.get("window").width * (1 / 6) - 40,
  },
  historyView: {
    position: "absolute",
    bottom: 90,
    left: Dimensions.get("window").width * (5 / 6) - 20,
    width: 125,
  },
  modalView: {
    width: "90%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  modalList: {
    flex: 1,
    marginTop: 20,
    marginLeft: 20,
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
