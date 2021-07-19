import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
    FREQUENT_QUESTIONS
} from "../../consts";
import FrequenteQuestions from "../../views/FrequentQuestions";
const Stack = createStackNavigator();

export default function FrequenteQuestionStackScreen() {
  return (
    <Stack.Navigator
      initialRouteName={FREQUENT_QUESTIONS}
      screenOptions={{ headerShown: false }}
    >
    <Stack.Screen name={FREQUENT_QUESTIONS} component={FrequenteQuestions} />

    </Stack.Navigator>
  );
}
