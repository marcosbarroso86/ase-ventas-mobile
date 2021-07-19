import React,{useEffect} from 'react';
import { Text, Button, Container, View } from 'native-base';
import { BackHandler } from "react-native";
import styles from './style';

import {LOGIN} from '../../consts';

export default function LogoutScreen ({navigation}){

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleOk);
    
        return () =>
          BackHandler.removeEventListener("hardwareBackPress", handleOk);
    }, []);

    const handleOk = async() => {
        navigation.navigate(LOGIN);
    }

    return (
            <Container style={styles.container}>
                <View style={styles.contentModal}>
                    <View>
                    <Text style={{ paddingTop: 10, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>La sesión expiró por inactividad</Text>
                    <Text style={{ paddingTop: 10, textAlign: 'center', fontSize: 14 }}>Por tu seguridad, se cerró la sesión debido a que no detectamos actividad en los últimos 10 minutos. Por favor iniciá sesión nuevamente.</Text>
                    </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Button warning style={{ width: 100 , margin: 10, backgroundColor: '#f16921' }} onPress={() => handleOk()}>
                            <Text style={{ flex: 1, textAlign: 'center' }}>Aceptar</Text>
                        </Button>
                    </View>
                </View>
            </Container>
    )
}