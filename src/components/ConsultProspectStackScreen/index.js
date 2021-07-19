import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import UploadProspect from "../UploadProspect";
import ProspectNotification from "../../views/ProspectNotification";
import {
  PROSPECT_NOTIFICATION,
  UPLOAD_PROSPECT,
} from "../../consts";

const Stack = createStackNavigator();

export default function ConsultPropspecStackScreen() {
  return (
    <Stack.Navigator
      initialRouteName={UPLOAD_PROSPECT}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={UPLOAD_PROSPECT} component={UploadProspect} />
      <Stack.Screen
        name={PROSPECT_NOTIFICATION}
        component={ProspectNotification}
      />
    </Stack.Navigator>
  );
}
