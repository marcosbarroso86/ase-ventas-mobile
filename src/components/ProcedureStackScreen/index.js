import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import FullScreenImage from '../FullScreenImage';
import FullScreenFile from '../FullScreenFile';
import { FULLSCREEN_IMAGE, FULLSCREEN_FILE ,NOTIFICATIONS, PROCEDURE, PROCEDURES } from '../../consts';
import Procedures from '../../views/Procedures';
import Procedure from '../../views/ProcedureDetail/procedure'
import Notifications from '../../views/Notifications';

const Stack = createStackNavigator();

export default function ProcedureStackScreen() {
    return (
        <Stack.Navigator initialRouteName={PROCEDURES}
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name={PROCEDURES} component={Procedures} />
            <Stack.Screen name={PROCEDURE} component={Procedure} />
            <Stack.Screen name={FULLSCREEN_IMAGE} component={FullScreenImage} />
            <Stack.Screen name={FULLSCREEN_FILE} component={FullScreenFile} />
            <Stack.Screen name={NOTIFICATIONS} component={Notifications} />
        </Stack.Navigator>
    )
}