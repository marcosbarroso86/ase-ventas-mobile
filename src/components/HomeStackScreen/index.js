import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import InfoProcedure from '../InfoProcedureScreen';
import Home from '../UploadProcedure';
import ProcedureNotification from '../../views/ProcedureNotification';
import { PROCEDURE_NOTIFICATION, TUTORIAL_PROCEDURE, UPLOAD_PROCEDURE } from '../../consts';
import TutorialProcedure from '../../views/TutorialProcedure';

const Stack = createStackNavigator();

export default function HomeStackScreen () {
    return (
        <Stack.Navigator initialRouteName={UPLOAD_PROCEDURE} 
            screenOptions={{headerShown: false}}
        >
            <Stack.Screen name={UPLOAD_PROCEDURE} component={Home} />
            <Stack.Screen name={PROCEDURE_NOTIFICATION} 
                options={({ navigation, route }) => ({})}         
                component={ProcedureNotification} 
            />
            <Stack.Screen name="InfoProcedure" 
                options={({ navigation, route }) => ({})}         
                component={InfoProcedure} 
            />
            <Stack.Screen name={TUTORIAL_PROCEDURE} 
                options={({ navigation, route }) => ({})}         
                component={TutorialProcedure} 
            />      
        </Stack.Navigator>  
    );
}