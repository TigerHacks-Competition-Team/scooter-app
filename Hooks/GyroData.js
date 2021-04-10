import React, { useState, useEffect } from "react";
import { DeviceMotion } from "expo-sensors";

export default () => {
  const [gyroData, setGyroData] = useState([]);
  useEffect(() => {
    subscription = DeviceMotion.addListener((gyroData) => {
      setGyroData(gyroData);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  return [gyroData];
};
