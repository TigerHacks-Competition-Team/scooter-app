import React from "react";
import { useEffect } from "react";
import { DeviceMotion } from "expo-sensors";

export default () => {
  const [gyroData, setGyroData] = React.useState([]);
  useEffect(() => {
    subscription = DeviceMotion.addListener((gyroData) => {
      setGyroData(gyroData);
    });
    return () => {
      DeviceMotion.removeAllListeners();
      DeviceMotion.removeSubscription();
    };
  }, []);

  return [gyroData];
};
