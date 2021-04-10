import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

export default () => {
  const [location, setLocation] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let subscription = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 10000, distanceInterval:0 },
      (loc) => {
        console.log(loc.coords.latitude)
        setLocation(loc)
      }
    )
  }, []);

  useEffect(() => {
    setResult(location);
  }, [location]);

  return [result];
};
