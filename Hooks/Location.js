import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

export default () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [result, setResult] = useState("Waiting");

  useEffect(() => {
    updateLocation();
  }, []);

  useEffect(() => {
    setResult(JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    setResult(errorMsg);
  }, [errorMsg]);

  const updateLocation = async () => {
    console.log("1");
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    console.log("2");
    let location = await Location.getCurrentPositionAsync({});
    Location.getCurrentPositionAsync();
    console.log("3");
    setLocation(location);
    setResult();
  };

  return [result, updateLocation];
};
