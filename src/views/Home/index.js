import React, { useEffect } from "react";
import { BackHandler } from "react-native";
import UploadProcedure from "../../components/UploadProcedure";

export default function Home({ navigation }) {

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleHardwareBackPress);

    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleHardwareBackPress
      );
    };
  });

  const handleHardwareBackPress = () => {
    return true;
  };

  return (
          <UploadProcedure />
  );
}
