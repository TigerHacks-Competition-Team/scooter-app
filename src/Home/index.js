import React, { useState } from "react";
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
import { FlatList } from "react-native-gesture-handler";

const vehicles = [
  {label: "car", value:200},
  {label: "scooter", value:100},
  {label: "walking", value:3}
]

const Home = () => {
  const [start, setStart] = useState(true);
  const [location, updateLocation] = getLocation();
  const [carbon, updateCarbon] = useState(vehicles[0].value);
  
  
  

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
        />
      </View>
      <View style={styles.dialContainer}>
        <DialButton title="Carbon Impact" />
        <DialButton title="Distance" />
        <DropDownPicker 
          items={vehicles} 
          defaultValue={carbon}
          containerStyle={{width: "33.2%", height: 50}}
          style={{backgroundColor: "black"}}
          arrowStyle={{backgroundColor: "white"}}
          itemStyle={{
            justifyContent: "flex-start"
          }}
          dropDownStyle={{backgroundColor: "black"}}
          globalTextStyle={{color: "white"}}
          onChangeItem={(item) => {updateCarbon(item.value); console.log(carbon)}}
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
