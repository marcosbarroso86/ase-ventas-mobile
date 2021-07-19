import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import * as Font from 'expo-font';
import { Spinner , Root } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootSiblingParent } from 'react-native-root-siblings';

import Store from './redux/store';
import { ROBOTO_FONT, ROBOTO_MEDIUM_FONT } from './consts';

import StackScreen from './components/StackScreen';
import LogoutScreen from './views/LogoutScreen';

const store = Store();
const ROBOTO = require('../node_modules/native-base/Fonts/Roboto.ttf');
const ROBOTO_MEDIUM = require('../node_modules/native-base/Fonts/Roboto_medium.ttf');

const Stack = createStackNavigator();

export default () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (!fontsLoaded) {
      loadFonts();
    }
  }, [fontsLoaded]);

  const loadFonts = async () => {
    await Font.loadAsync({
      [ROBOTO_FONT]: ROBOTO,
      [ROBOTO_MEDIUM_FONT]: ROBOTO_MEDIUM
    });

    setFontsLoaded(true);
  };

  if (!fontsLoaded) {
    return <Spinner color="#f16921"/>
  }

  return (
    <RootSiblingParent>
      <Root>
        <Provider store={store}>
          <NavigationContainer initialRouteName="Home">
            <Stack.Navigator
              screenOptions={{
                headerShown: false
              }}
            >
              <Stack.Screen name="Home" component={StackScreen} />
              <Stack.Screen name="SystemSessionOut" component={LogoutScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
      </Root>
    </RootSiblingParent>
  );
}
