import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../../views/Login";
import RegistrationBegin from "../../views/RegistrationBegin";
import RegistrationEnd from "../../views/RegistrationEnd";
import EmailNotification from "../../views/EmailNotification";
import KeyActivation from "../../views/KeyActivation";
import PasswordRecovery from "../../views/PasswordRecovery";
import PasswordConfirm from "../../views/PasswordConfirm";
import {
  LOGIN_TITLE,
  REGISTRATION_BEGIN,
  REGISTRATION_END,
  EMAIL_NOTIFICATION,
  KEY_ACTIVATION,
  PASSWORD_RECOVERY,
  PASSWORD_CONFIRM,
  TERMS_AND_CONDITIONS,
  FREQUENT_QUESTIONS,
} from "../../consts";
import TermsAndConditions from "../../views/TermsAndConditions";
import FrequentQuestions from "../../views/FrequentQuestions";

const Stack = createStackNavigator();

export default function LoginScreen({ navigation }) {
  return (
    <Stack.Navigator
      initialRouteName={LOGIN_TITLE}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={LOGIN_TITLE} component={Login} />
      <Stack.Screen name={REGISTRATION_BEGIN} component={RegistrationBegin} />
      <Stack.Screen
        name={TERMS_AND_CONDITIONS}
        component={TermsAndConditions}
      />
      <Stack.Screen name={REGISTRATION_END} component={RegistrationEnd} />
      <Stack.Screen name={EMAIL_NOTIFICATION} component={EmailNotification} />
      <Stack.Screen name={KEY_ACTIVATION} component={KeyActivation} />
      <Stack.Screen name={PASSWORD_RECOVERY} component={PasswordRecovery} />
      <Stack.Screen name={PASSWORD_CONFIRM} component={PasswordConfirm} />
      <Stack.Screen name={FREQUENT_QUESTIONS} component={FrequentQuestions} />
    </Stack.Navigator>
  );
}
