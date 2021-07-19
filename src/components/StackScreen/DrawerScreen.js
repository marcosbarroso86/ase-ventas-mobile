import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CalculatorResults from "../../views/CalculatorResults";
import Confirmation from "../ConfirmationScreen";
import HomeStackScreen from "../HomeStackScreen";
import NotificationStackScreen from "../NotificationStackScreen";
import ProcedureStackScreen from "../ProcedureStackScreen";
import ConsultProspectStackScreen from "../ConsultProspectStackScreen";
import ProspectViewStackScreen from "../ProspectViewStackScreen ";
import FrequentQuestionStackScreen from "../FrequentQuestionStackScreen";
import customDrawer from './CustomDrawer';

import {
  HOME_TITLE,
  NOTIFICATION_FILTERS_TITLE,
  CALCULATOR_RESULTS_TITLE,
  SYSTEM_LOGOUT_TITLE,
  PROCEDURES_TITLE,
  PROSPECTS_TITLE,
  PROSPECTS_VIEW_TITLE,
  FREQUENT_QUESTIONS_TITLE
} from "../../consts";

export default () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContentOptions={{
        activeTintColor: "#f16921",
        itemStyle: { marginVertical: 5 },
      }}
      drawerContent={customDrawer}
      edgeWidth={-100}
    >
      <Drawer.Screen
        name="Home"
        component={HomeStackScreen}
        options={() => ({
          title: HOME_TITLE,
          headerRight: () => (
            <AntDesign
              name="infocirlceo"
              onPress={() => console.log("infoProcedure click")}
              size={24}
              color="black"
            />
          ),
          headerLeft: () => (
            <AntDesign
              name="menufold"
              onPress={() => console.log("Menu Button")}
              color="black"
              size={23}
            />
          ),
        })}
        testID={"btnNewProcedure"}
        accessibilityLabel={"btnNewProcedure"}
      />

      <Drawer.Screen
        name="ProceduresStack"
        component={ProcedureStackScreen}
        options={() => ({
          title: PROCEDURES_TITLE,
        })}
        testID={"btnProcedures"}
        accessibilityLabel={"btnProcedures"}
      />

      <Drawer.Screen
        name="ConsultProspectStack"
        component={ConsultProspectStackScreen}
        options={() => ({
          title: PROSPECTS_TITLE,
        })}
        testID={"btnConsultProspectStack"}
        accessibilityLabel={"btnConsultProspectStack"}
      />

      <Drawer.Screen
        name="ProspectViewStack"
        component={ProspectViewStackScreen}
        options={() => ({
          title: PROSPECTS_VIEW_TITLE,
        })}
        testID={"btnProspectsView"}
        accessibilityLabel={"btnProspectsView"}
      />

      <Drawer.Screen
        name="NotificationStack"
        component={NotificationStackScreen}
        options={() => ({
          title: NOTIFICATION_FILTERS_TITLE,
        })}
        testID={"btnNotifications"}
        accessibilityLabel={"btnNotifications"}
      />

      <Drawer.Screen name="CalculatorResults"
          component={CalculatorResults}
        options={() => ({
          title: CALCULATOR_RESULTS_TITLE,
          })}
          testID={"btnContributionCalculator"} accessibilityLabel={"btnContributionCalculator"}
      />

      <Drawer.Screen 
        name="FrequentQuestionsStackScreen"
        options={() => ({
          title: FREQUENT_QUESTIONS_TITLE,
        })}
        component={FrequentQuestionStackScreen}
        testID={"btnFrequentQuestions"}
        accessibilityLabel={"btnFrequentQuestions"}
      />

      <Drawer.Screen
        name="SystemLogout"
        options={() => ({
          title: SYSTEM_LOGOUT_TITLE,
        })}
        component={Confirmation}
        testID={"btnLogOut"}
        accessibilityLabel={"btnLogOut"}
      />
    </Drawer.Navigator>
  );
};
