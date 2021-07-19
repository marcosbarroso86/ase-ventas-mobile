import React, { useState, useCallback } from 'react';
import {
    Platform,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Image,
    View,
    KeyboardAvoidingView,
} from "react-native";
import Toast from 'react-native-root-toast';
import { useFocusEffect } from '@react-navigation/native';
import {  Text, Button, Form, Item, Input} from "native-base";
import { Icon } from 'native-base';
import Constants from "expo-constants";

import InfoModal from "../../components/Modals/InfoModal";
import {validatePasswordCode} from '../../redux/api/executive';
import genericStyles from '../../styles';
import styles from './style';

import { REGISTRATION_END, PASSWORD_CONFIRM, LOGIN, ERROR_INVALID_CODE_MESSAGE, REGISTRATION_BEGIN, USER_CREATED_SUCCESS } from '../../consts';

export default function KeyActivation({route, navigation}){

    const [activationCode, setActivationCode] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [serviceError, setServiceError] = useState("");
    const [isErrModal, setIsErrModal] = useState(false);

    const sourceView = (route.params) ? route.params.sourceView : "";
    const email = (route.params) ? route.params.email : "";

    useFocusEffect(
        useCallback(() => {
            setActivationCode("");
        }, [])
    );

    const handleEntry = async() =>{
        try {
                await handleValidatePasswordCode();
                if(sourceView === REGISTRATION_END)  
                {
                    Toast.show(USER_CREATED_SUCCESS, {
                        duration: Toast.durations.SHORT,
                    });
                }
                navigation.reset({
                    index: 0,
                    routes: [{ name: LOGIN }]
                });
        } catch (error) {
            setServiceError(error.message);
            if(error.message !== ERROR_INVALID_CODE_MESSAGE){
                setIsErrModal(true);
            } 
        }
    }

    const handleValidatePasswordCode = async() =>{
        let payload = {};
        const code = activationCode;
        payload = {email,code};
        try {
            const response = await validatePasswordCode(payload);
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const toggleErrModal = () => {
        setIsErrModal(false);
    };

    const handleGoBack = () => {
        navigation.goBack();
    }

    const handleActivationCodeChange = code =>{
        setServiceError("");
        setActivationCode(code);
        if(code.trim().length < 4){
            setDisabled(true);
            return;
        }else{
            setDisabled(false);
        }
    };

    const handleButtonValidateKey = async() =>{
        try {
            await handleValidatePasswordCode();
            let params = {email};
            navigation.navigate(PASSWORD_CONFIRM,params);
        } catch (error) {
            setServiceError(error.message);
            if(error.message !== ERROR_INVALID_CODE_MESSAGE){
                setIsErrModal(true);
            } 
        }
        
    }

    const { height } = Dimensions.get('window');

    return(
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS == "ios" ? 0 : -100}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ minHeight: height-Constants.statusBarHeight }}>
                        <View style={{ backgroundColor: '#7a7e7f', flex: 1, justifyContent: 'center', }}>
                            <View style={{ alignItems: 'flex-start', top: 35, position: 'absolute' }}>
                                <Icon testID={"backButtonKeyActivation"} accessibilityLabel={"backButtonKeyActivation"} style={{ marginLeft: 20 , color: '#fff' }} size={24} name="arrow-back" onPress={ handleGoBack }/>
                            </View>
                            <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginBottom: 16, }}>
                                <Image testID={"imgLogoKeyActivation"} accessibilityLabel={"imgLogoKeyActivation"} source={require('../../../assets/ase_nacional_imagen_app.png')} style={{ width: 180, height: 60 }} />
                            </View>
                        </View>
                        <View style={{ flex: 0.1, justifyContent: 'center', alignContent: 'center', }}>
                            <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', }}>
                            {
                                (sourceView === REGISTRATION_END || sourceView === LOGIN || sourceView === REGISTRATION_BEGIN) ?(
                                    <Text testID={"titleKeyActivation"} accessibilityLabel={"titleKeyActivation"} style={{ textAlign: 'center', margin: 16, fontWeight: 'bold', }}>ACTIVACIÓN DE CUENTA</Text>
                                ):(
                                    <Text testID={"titleKeyActivation"} accessibilityLabel={"titleKeyActivation"} style={{ textAlign: 'center', margin: 16, fontWeight: 'bold', }}>RECUPERO DE CLAVE</Text>
                                )
                            }
                                <Text testID={"txtParagraphOneKeyActivation"} accessibilityLabel={"txtParagraphOneKeyActivation"} style={{ width: '75%', fontSize: 14 }}>Si llegaste a esta pantalla es porque recibiste el código de activación de tu cuenta.</Text>
                                                                                
                                <Text testID={"txtParagraphTwoKeyActivation"} accessibilityLabel={"txtParagraphTwoKeyActivation"} style={{ margin: 16, width: '75%', fontSize: 14, }}>Ingresá el código de activación que te enviamos por mail.</Text>
                            </View>
                            <Form style={{ margin: 24, }}>
                                {
                                    (serviceError === ERROR_INVALID_CODE_MESSAGE) ?(
                                        <>
                                            <Item style={{borderBottomColor:'red', borderBottomWidth:2}}>
                                                <Input testID={"inputActivationCode"} accessibilityLabel={"inputActivationCode"} value={activationCode} keyboardType="number-pad" placeholder="Código" onChangeText = {handleActivationCodeChange} maxLength={4} />
                                            </Item> 
                                            <Item style={{borderBottomWidth:0}}>
                                                <Text testID={"lblErrorInvalidCode"} accessibilityLabel={"lblErrorInvalidCode"} style={{color:'red' }}>{serviceError} <Icon style={{color:'red', fontSize:20}} name='ios-warning'></Icon></Text>
                                            </Item>
                                        </>
                                    ):(
                                        <Item >
                                            <Input testID={"inputActivationCode"} accessibilityLabel={"inputActivationCode"} value={activationCode} keyboardType="number-pad" placeholder="Código" onChangeText = {handleActivationCodeChange} maxLength={4} />
                                        </Item> 
                                    )
                                }
                            </Form>
                        </View>
                        <View style={{ flex: 0.1, justifyContent: 'flex-end', margin: 32, }}>

                            {
                                (sourceView ===REGISTRATION_END || sourceView === LOGIN || sourceView === REGISTRATION_BEGIN) ?(
                                    <>
                                        <Button testID={"btnValidateCodeKeyActivation"} accessibilityLabel={"btnValidateCodeKeyActivation"}
                                            onPress={() => handleEntry()} 
                                            light
                                            style={[genericStyles.btnShadow, styles.button, { backgroundColor: activationCode.trim().length < 4 ? '#FDE1D3' : '#F16921', borderColor: '#F16820' }]}
                                            disabled={disabled}
                                        >
                                            <Text testID={"lblBtnValidateCodeKeyActivation"} 
                                                accessibilityLabel={"lblBtnValidateCodeKeyActivation"} 
                                                style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color:'white', borderRadius: 4 }} >
                                                    INGRESAR
                                            </Text>
                                        </Button>
                                    </>
                                ):(
                                    <Button testID={"btnValidateCodeKeyActivation"} accessibilityLabel={"btnValidateCodeKeyActivation"}
                                        onPress={() => handleButtonValidateKey()}
                                        light
                                        style={[styles.button, { backgroundColor: activationCode.trim().length < 4 ? '#FDE1D3' : '#F16921', borderColor: '#F16820'}]}
                                        disabled={disabled}
                                    >
                                        <Text testID={"lblBtnValidateCodeKeyActivation"} 
                                            accessibilityLabel={"lblBtnValidateCodeKeyActivation"} 
                                            style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color:'white', borderRadius: 4 }}>
                                                VALIDAR CÓDIGO
                                        </Text>
                                    </Button>
                                )
                            }
                            <InfoModal isVisible={isErrModal} message={serviceError} 
                                handleAccept={toggleErrModal} />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )

}
