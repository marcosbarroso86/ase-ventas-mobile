import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  NOTIFICATIONS,
  NOTIFICATION_FILTERS,
  PROCEDURE,
  FULLSCREEN_IMAGE,
  FULLSCREEN_FILE,
} from "../../consts";
import NotificationFilters from "../../views/NotificationFilters";
import Notifications from "../../views/Notifications";
import Procedure from "../../views/ProcedureDetail/procedure";
import FullScreenImage from "../FullScreenImage";
import FullScreenFile from "../FullScreenFile";

const Stack = createStackNavigator();

export default function NotificationStackScreen() {
  return (
    <Stack.Navigator
      initialRouteName={NOTIFICATION_FILTERS}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name={NOTIFICATION_FILTERS}
        component={NotificationFilters}
      />
      <Stack.Screen name={NOTIFICATIONS} component={Notifications} />
      <Stack.Screen name={PROCEDURE} component={Procedure} />
      <Stack.Screen name={FULLSCREEN_IMAGE} component={FullScreenImage} />
      <Stack.Screen name={FULLSCREEN_FILE} component={FullScreenFile} />
    </Stack.Navigator>
  );
}
