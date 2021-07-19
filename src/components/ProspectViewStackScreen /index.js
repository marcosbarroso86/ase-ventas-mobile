import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Prospects from "../../views/Prospects";
import { PROSPECTS } from "../../consts";

const Stack = createStackNavigator();

export default function ProspectStackScreen() {
  return (
    <Stack.Navigator
      initialRouteName={PROSPECTS}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={PROSPECTS} component={Prospects} />
    </Stack.Navigator>
  );
}
