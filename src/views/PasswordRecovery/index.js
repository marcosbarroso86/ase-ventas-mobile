import React, { useState } from "react";
import {
  Platform,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Image,
  View,
  KeyboardAvoidingView,
} from "react-native";
import {  Text, Button, Form, Item, Input, Icon } from "native-base";
import Constants from "expo-constants";
import genericStyles from '../../styles';

import styles from './style';
import InfoModal from "../../components/Modals/InfoModal";

import { EMAIL_NOTIFICATION, WRONG_FORMAT_EMAIL, PASSWORD_RECOVERY, ERROR_INVALID_EMAIL, PENDING_VALIDATION_MESSAGE, REGISTRATION_BEGIN } from '../../consts';
import { generatePasswordCode, getExecutive } from '../../redux/api/executive';
import {validateEmail} from '../../utils/index'

export default function PasswordRecovery({ navigation }) {

  const [email, setEmail] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState("");
  const [isErrModal, setIsErrModal] = useState(false);

  const handleChangeEmail = (text) => {
    setError("");
    if(text.trim()){
      setDisabled(false);
    }else{
      setDisabled(true);
    }
    setEmail(text);
  }

  const toggleErrModal = () => {
    setIsErrModal(false);
    if (error.includes(PENDING_VALIDATION_MESSAGE)) {
      validateUser();
    } else {
      clearAll();
    }
  };

  const clearAll = () => {
    setEmail('');
    setDisabled(true);
    setError('');
    setIsErrModal(false);
  }

  const validateUser = () => {
    let params = {};
    params.sourceView = REGISTRATION_BEGIN;
    params.email = email;
    navigation.navigate(EMAIL_NOTIFICATION, params);
  }

  const handleSendEmail = async() => {
    const payload = { email }
    if (validateEmail(email)) {
      try {
        const executive = await getExecutive({ email});

        await generatePasswordCode(payload);
        if (executive.length > 0 && !executive[0].valid) {
          setError(PENDING_VALIDATION_MESSAGE);
          setIsErrModal(true);
          return
        }
        let params = { email };
        params.sourceView = PASSWORD_RECOVERY;
        navigation.navigate(EMAIL_NOTIFICATION, params);
      } catch (err) {
        setError(err.message);
        if (err.message !== ERROR_INVALID_EMAIL) {
          setIsErrModal(true);
        }
      }
    } else {
      setError(WRONG_FORMAT_EMAIL);
    }
  }

  const handleGoBack = () => {
    navigation.goBack();
  }

  const { height } = Dimensions.get('window');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS == "ios" ? 0 : -100}>
        <ScrollView keyboardShouldPersistTaps = 'always' style={{ flex: 1 }}>
          <View style={{ minHeight: height-Constants.statusBarHeight }}>
            <View style={{ backgroundColor: '#7a7e7f', flex: 1, justifyContent: 'center', }}>
            <View style={{ alignItems: 'flex-start', top: '15%', position: 'absolute'}}>
            <Icon testID={"backButtonPasswordRecovery"} accessibilityLabel={"backButtonPasswordRecovery"}
                  style={{ marginLeft: 20 , color: '#fff' }} size={24} name="arrow-back" onPress={ handleGoBack }/>
            </View>
              <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginBottom: 16, }}>
                <Image testID={"imgLogoPasswordRecovery"} accessibilityLabel={"imgLogoPasswordRecovery"} source={require('../../../assets/ase_nacional_imagen_app.png')} style={{ width: 180, height: 60 }} />
              </View>
            </View>
            <View style={{ flex: 0.1, justifyContent: 'center', alignContent: 'center', }}>
              <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', }}>
                <Text testID={"titlePasswordRecovery"} accessibilityLabel={"titlePasswordRecoveryPasswordRecovery"} style={{ textAlign: 'center', margin: 16, fontWeight: 'bold', }}>RECUPERO DE CLAVE</Text>
                <Text testID={"txtParagraphOnePasswordRecovery"} accessibilityLabel={"txtParagraphOnePasswordRecovery"} style={{ width: '75%', fontSize: 14 }}>Si ya tenés creada tu cuenta y no recordás la clave ingresá el mail que usaste durante la registración y presioná ENVIAR.</Text>
                <Text testID={"txtParagraphTwoPasswordRecovery"} accessibilityLabel={"txtParagraphTwoPasswordRecovery"} style={{ margin: 16, width: '75%', fontSize: 14, }}>En instantes te enviaremos un código para que puedas generar una nueva clave.</Text>
              </View>
              <Form style={{ margin: 24, }}>

                  {
                      (error) ?(
                          <>
                              <Item style={{borderBottomColor:'red', borderBottomWidth:2}}>
                                  <Input testID={"inputEmailError"} accessibilityLabel={"inputEmailError"} keyboardType="email-address" placeholder="Mail" onChangeText={text => handleChangeEmail(text)} value={email} style={{borderColor:'red' }}/>
                              </Item> 
                              <Item style={{borderBottomWidth:0}}>
                                  <Text testID={"lblEmailError"} accessibilityLabel={"lblEmailError"} style={{color:'red' }}>{error} <Icon style={{color:'red', fontSize:20}} name='ios-warning'></Icon></Text>
                              </Item>
                          </>
                      ):(
                            <Item >
                              <Input testID={"inputEmail"} accessibilityLabel={"inputEmail"} keyboardType="email-address" placeholder="Mail" onChangeText={text => handleChangeEmail(text)} value={email}/>
                            </Item> 
                        )
                  }
              </Form>
            </View>
            <View style={{ flex: 0.1, justifyContent: 'flex-end', margin: 32, }}>
              <Button testID={"btnSend"} accessibilityLabel={"btnSend"} style={[genericStyles.btnShadow, !disabled ? { backgroundColor: '#F16921', borderColor: '#f16820' } : { backgroundColor: '#FDE1D3', borderColor: '#f16820' }]} onPress={handleSendEmail} disabled={disabled}>
                <Text testID={"lblBtnSend"} accessibilityLabel={"lblBtnSend"} style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', borderRadius: 4 }}>ENVIAR</Text>
              </Button>
              <InfoModal isVisible={isErrModal} message={error} handleAccept={toggleErrModal}
                buttonText={(error === PENDING_VALIDATION_MESSAGE) ? 'CONTINUAR' : 'ACEPTAR'} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}