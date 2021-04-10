import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

export default () => {
  const [location, setLocation] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    console.log("1234")
    let subscription = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 3 },
      (loc) => {
        console.log(`${loc.coords.latitude}, ${loc.coords.longitude}`)
        setLocation(loc)
      }
    )
  }, []);

  useEffect(() => {
    setResult(location);
  }, [location]);

  return [result];
};
