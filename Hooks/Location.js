import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

export default () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    updateLocation();
  }, []);

  useEffect(() => {
    setResult(location);
  }, [location]);

  useEffect(() => {
    console.log(errorMsg)
    setResult(null);
  }, [errorMsg]);

  const updateLocation = async () => {
    console.log("1")
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    console.log("2")
    let location = await Location.getCurrentPositionAsync({});
    console.log("3")
    setLocation(location);
  };

  return [result, updateLocation];
};
