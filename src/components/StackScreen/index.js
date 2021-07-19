import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserInactivity from 'react-native-user-inactivity';

import DrawerScreen from './DrawerScreen';
import LoginScreen from './LoginScreen';

import { SYSTEM_SESSION_OUT } from '../../consts';
import { logOut } from '../../redux/ducks/authenticateDucks';

export default function StackScreen({ navigation }) {

  const dispatch = useDispatch();
  const handleTimeout = async () => {
    dispatch(logOut());
    navigation.navigate(SYSTEM_SESSION_OUT);
  }

  const isLoged = useSelector(store => store.authentication.loged);

  return (
      isLoged ? 
      (
        <UserInactivity
          isActive={isLoged}
          timeForInactivity={60 * 1000 * 10} //10 min
          onAction={(isActive) => { if (isActive) handleTimeout(); }}
        >
          <DrawerScreen />
        </UserInactivity>
        )
        :
        (<LoginScreen />)
        
  )
} 