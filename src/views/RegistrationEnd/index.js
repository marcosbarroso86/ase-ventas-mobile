import React, { useEffect, useState, useCallback, useRef } from "react";
import { Image, View, SafeAreaView, KeyboardAvoidingView, ScrollView, TouchableOpacity } from "react-native";
import { Button, Text, Form, Item, Input, Icon, Picker,Spinner } from "native-base";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import genericStyles from '../../styles';

import styles from './style';

import { createExecutive, getExecutive } from '../../redux/api/executive';
import { useDispatch, useSelector } from "react-redux";
import { networks, setInitialStateIntegration, zones } from '../../redux/ducks/integrationDucks';

import InfoModal from "../../components/Modals/InfoModal";
import {
  EMAIL_NOTIFICATION,
  REGISTRATION_END,
  PASSWORDS_MUST_BE_EQUALS,
  REGISTRATION_BEGIN,
  PASSWORD_ERROR_VALIDATION_MSSG,
  PENDING_VALIDATION_MESSAGE
} from "../../consts";

import {validatePassword} from '../../utils';

export default function RegistrationEnd({ route, navigation }) {

  const [network, setNetwork] = useState('')
  const [filialZone, setFilialZone] = useState({})
  const [region, setRegion] = useState('');
  const [eye, setEye] = useState('md-eye');
  const [eyePasswordRepeated, setEyePasswordRepeated] = useState('md-eye');
  const [secureEntry, setSecureEntry] = useState(true);
  const [securePasswordRepeatedEntry, setSecurePasswordRepeatedEntry] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordRepeated, setPasswordRepeated] = useState('');
  const [errMssg, setErrMssg] = useState('');
  const [serviceError, setServiceError] = useState("");
  const [isErrModal, setIsErrModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const repeatPasswordInput = useRef(null);

  const dispatch = useDispatch();

  const firstName = (route.params) ? route.params.firstName : '';
  const lastName = (route.params) ? route.params.lastName : '';
  const cuil = (route.params) ? route.params.cuil : '';
  const email = (route.params) ? route.params.email : '';
  const gender = (route.params) ? route.params.gender : '';
  const phoneNumber = (route.params) ? route.params.fullPhone : '';

  const networkUnsorted = useSelector(store => store.integration.networks);
  const networkArray = (networkUnsorted) ? ([{ businessName: 'Seleccionar...' }, ...networkUnsorted.sort((a, b) => (a.businessName > b.businessName) ? 1 : -1)]) : [{ businessName: 'Seleccionar...' }];

  const zonesUnsorted = useSelector(store => store.integration.zones);
  const zonesArray = (zonesUnsorted) ? [{ description: 'Seleccionar...' }, ...zonesUnsorted] : [{ description: 'Seleccionar...' }];

  const error = useSelector(store=> store.integration.error);

  useFocusEffect(
    useCallback(() => {
      clearAll();
      setServiceError("");
      hidePasswordFields();
      dispatch(networks());
      dispatch(zones());
      setNetwork('Seleccionar...');
      setFilialZone('Seleccionar...');
    }, [])
  );

  const hidePasswordFields = () => {
    setEyePasswordRepeated('md-eye');
    setEye('md-eye');
    setSecureEntry(true);
    setSecurePasswordRepeatedEntry(true);
  }

  const clearAll = () => {
    setNetwork("");
    setFilialZone({});
    setRegion("");
    setIsEnabled(false);
    setPassword("");
    setPasswordRepeated("");
    setErrMssg("");
    hidePasswordFields();
  }

  useEffect(() => {
    if(error){
      setServiceError(error);
      setIsErrModal(true);
      dispatch(setInitialStateIntegration());
    }
  },[error])

  const navigateNextView = () =>{
    clearAll();
    let params = {};
    params.sourceView = REGISTRATION_END;
    params.email = email;
    navigation.navigate(EMAIL_NOTIFICATION, params);
  }

  const handleNetwork = (value) => {
    setNetwork(value);
  }

  const handleZone = (value) => {
    setIsEnabled(false);
    setRegion(value.region?.length > 0 ? value.region[0].regionDsc.trim() : "");
    setFilialZone(value);
    if (value.region?.length > 1) setIsEnabled(true);
  }

  console.log('region', region)

  const handleRegion = (value) => {
    setRegion(value);
  }

  const handleGoBack = () => {
    const params = {goBack:true};
    navigation.navigate(REGISTRATION_BEGIN,params);
  }

  const toggleErrModal = () => {
    setIsErrModal(false);
    if (serviceError === PENDING_VALIDATION_MESSAGE) {
      let params = {};
      params.sourceView = REGISTRATION_BEGIN;
      params.email = email;
      navigation.navigate(EMAIL_NOTIFICATION, params);
    }
  }

  const handleSend = async() => {
    let mssgError = '';
    mssgError = validatePassword(password, passwordRepeated);
    if(mssgError){   
      setErrMssg(mssgError);
    }else{
      const payload = { lastName, firstName, cuil, password, email, gender, network, filialZone: region, phoneNumber };
      try {
        setLoading(true);
        const executive = await getExecutive({ email });
        if (executive && executive.length > 0) {
          setServiceError(PENDING_VALIDATION_MESSAGE);
          setIsErrModal(true);
          return
        }
        await createExecutive(payload);
        navigateNextView();
      } catch (err) {
        setServiceError(err.message);
        setIsErrModal(true);
      }finally{
        setLoading(false);
      }
    }
  }

  const handleChangePassword = (text) => {
    setErrMssg("");
    setPassword(text);
  }

  const handleChangePasswordRepeated = (text) => {
    setErrMssg("");
    setPasswordRepeated(text);
  }

  const handleTouchableOpacity = async () => {
    const eyeName = secureEntry ? 'md-eye-off' : 'md-eye';
    setSecureEntry(!secureEntry);
    setEye(eyeName);
  }

  const handleTouchableOpacityPasswordRepeated = async () => {
    const eyeNamePswdRepeated = securePasswordRepeatedEntry ? 'md-eye-off' : 'md-eye';
    setSecurePasswordRepeatedEntry(!securePasswordRepeatedEntry);
    setEyePasswordRepeated(eyeNamePswdRepeated);
  }

  const handleForm = () => {
    if (network.trim() === 'Seleccionar...' || region.trim() === '' || password.trim() === '' || passwordRepeated.trim() === '') {
      return false;
    }
    return true;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS == "ios" ? 0 : -100}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ minHeight: 700 }}>
            <View style={{ backgroundColor: '#7a7e7f', justifyContent: 'center', minHeight: 200, }}>
              <View style={{ alignItems: 'flex-start', top: -20, }}>
                  <Icon testID={"backButtonRegistrationEnd"} accessibilityLabel={"backButtonRegistrationEnd"} style={{ marginLeft: 24 , color: '#fff' }} size={24} name="arrow-back" onPress={ handleGoBack }/>
              </View>
              <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', }}>
                <Image testID={"imgLogoRegistrationEnd"} accessibilityLabel={"imgLogoRegistrationEnd"} source={require('../../../assets/ase_nacional_imagen_app.png')} style={{ width: 180, height: 60 }} />
              </View>
            </View>
            <View style={{ backgroundColor: 'white', flex: 1, alignContent: 'center', }}>
              <View style={{ margin: 10 }}>
                <Text testID={"titleRegistrationEnd"} accessibilityLabel={"titleRegistrationEnd"} style={{ textAlign: 'center', margin: 10, fontWeight: 'bold', }}>REGISTRO 2/2</Text>
                {
                  (loading) ? (
                                <Spinner color="#f16921"></Spinner>
                  ):(
                      <>  
                        <Form style={{ margin: 10, }}>
                          <Text testID={"lblNetwork"} accessibilityLabel={"lblNetwork"} style={{ textAlign: 'left', marginLeft: 10, marginBottom: -10, fontSize: 13 }}>Red</Text>
                          <Item picker style={styles.pickerContainer}>
                            <Picker testID={"SelectNetwork"} accessibilityLabel={"SelectNetwork"} mode="dropdown" iosIcon={<Icon name="arrow-down" />}
                              iosHeader="Seleccione"
                              placeholder="Seleccionar..."
                              headerBackButtonText="Volver"
                              placeholderStyle={{ color: "black" }}
                              placeholderIconColor="#007aff"
                              textStyle={{ width: '85%' }}
                              selectedValue={network} onValueChange={(itemValue) => handleNetwork(itemValue)}>
                              {
                                networkArray.map((v, i) => <Picker.Item testID={`networkOption${i}`} accessibilityLabel={`networkOption${i}`} label={v.businessName.trim()} value={v.businessName.trim()} key={i} />)
                              }

                            </Picker>
                          </Item>
                          <Text testID={"lblZone"} accessibilityLabel={"lblZone"} style={{ textAlign: 'left', marginLeft: 10, marginTop: 20, marginBottom: -10, fontSize: 13 }}>Zona</Text>
                          <Item picker style={styles.pickerContainer}>
                            <Picker testID={"pickerZone"} accessibilityLabel={"pickerZone"} mode="dropdown" iosIcon={<Icon name="arrow-down" />}
                              headerBackButtonText="Volver"
                              placeholder="Seleccionar..."
                              placeholderStyle={{ color: "black" }}
                              placeholderIconColor="#007aff"
                              iosHeader="Seleccione"
                              selectedValue={filialZone} onValueChange={(itemValue) => handleZone(itemValue)}>
                              {
                                zonesArray.map((v, i) => <Picker.Item testID={`zoneOptions${i}`} accessibilityLabel={`zoneOptions${i}`} label={v.description.trim()} value={v.id ? v : v.description.trim()} key={i} />)
                              }
                            </Picker>
                          </Item>
                          <Text testID={"lblRegion"} accessibilityLabel={"lblRegion"} style={{ textAlign: 'left', marginLeft: 10, marginTop: 20, marginBottom: -10, fontSize: 13 }}>Región</Text>
                          <Item picker style={[styles.pickerContainer, !isEnabled && styles.disabledInput]}>
                            <Picker testID={"pickerRegion"} accessibilityLabel={"pickerRegion"} mode="dropdown" iosIcon={<Icon name="arrow-down" />}
                              headerBackButtonText="Volver"
                              iosHeader="Seleccione"
                              placeholderIconColor="#007aff" enabled={isEnabled}
                              selectedValue={region.trim()} onValueChange={(itemValue) => handleRegion(itemValue)}
                            >
                              {
                                filialZone.region?.map((v, i) =>
                                  < Picker.Item testID={`regionOption${i}`} accessibilityLabel={`regionOption${i}`} label={v.regionDsc.trim()} value={v.regionDsc.trim()} key={v.regionDsc.trim()} />
                                )
                              }
                            </Picker>
                          </Item>
                        </Form>
                        <Form style={{ margin: 10 , justifyContent: 'center' }}>
                          
                            {
                              (errMssg === PASSWORDS_MUST_BE_EQUALS || errMssg === PASSWORD_ERROR_VALIDATION_MSSG) ? (
                                <>
                                  <Item style={{borderColor:'red', borderBottomWidth:2,marginLeft:0}}>
                                  <Input testID={"inputPassword"} accessibilityLabel={"inputPassword"} placeholder="Clave" value={password} contextMenuHidden={true} onChangeText={handleChangePassword} secureTextEntry={secureEntry} maxLength={32} returnKeyType={'next'} onSubmitEditing={() => repeatPasswordInput.current._root.focus()} />
                                    <TouchableOpacity onPress={handleTouchableOpacity}>
                                      <Ionicons testID={"btnEyesPassword"} accessibilityLabel={"btnEyesPassword"} name={eye} size={24} color="gray" />
                                    </TouchableOpacity>
                                  </Item>
                                  <Item style={{borderColor:'red', borderBottomWidth:2,marginLeft:0}}>
                                  <Input testID={"inputPasswordRepeat"} accessibilityLabel={"inputPasswordRepeat"} placeholder="Repetir clave" contextMenuHidden={true} value={passwordRepeated} onChangeText={handleChangePasswordRepeated} secureTextEntry={securePasswordRepeatedEntry} maxLength={32} ref={repeatPasswordInput}/>
                                    <TouchableOpacity onPress={handleTouchableOpacityPasswordRepeated}>
                                      <Ionicons testID={"btnEyesPasswordRepeated"} accessibilityLabel={"btnEyesPasswordRepeated"} name={eyePasswordRepeated} size={24} color="gray" />
                                    </TouchableOpacity>
                                  </Item>
                                  <Item style={{borderBottomWidth:0,marginLeft:0}}>
                                    <Text testID={"inputPasswordError"} accessibilityLabel={"inputPasswordError"} style={{color:'red'}}>{errMssg} <Icon style={{color:'red', fontSize:20}} name='ios-warning'></Icon></Text>
                                  </Item>
                                </>
                              ):(
                                <>
                                  <Item style={{marginLeft:0}}>
                                    <Input testID={"inputPassword"} accessibilityLabel={"inputPassword"} placeholder="Clave" value={password} onChangeText={handleChangePassword} contextMenuHidden={true} secureTextEntry={secureEntry} maxLength={32} returnKeyType={'next'} onSubmitEditing={() => repeatPasswordInput.current._root.focus()} />
                                    <TouchableOpacity  onPress={handleTouchableOpacity}>
                                      <Ionicons testID={"btnEyesPassword"} accessibilityLabel={"btnEyesPassword"} name={eye} size={24} color="gray" />
                                    </TouchableOpacity>
                                  </Item>
                                  <Item style={{marginLeft:0}}>
                                    <Input testID={"inputPasswordRepeat"} accessibilityLabel={"inputPasswordRepeat"} placeholder="Repetir clave" contextMenuHidden={true} value={passwordRepeated}  onChangeText= {handleChangePasswordRepeated} secureTextEntry={securePasswordRepeatedEntry} maxLength={32} ref={repeatPasswordInput} />
                                    <TouchableOpacity onPress={handleTouchableOpacityPasswordRepeated}>
                                      <Ionicons testID={"btnEyesPasswordRepeated"} accessibilityLabel={"btnEyesPasswordRepeated"} name={eyePasswordRepeated} size={24} color="gray" />
                                    </TouchableOpacity>
                                  </Item>
                                </>
                              )
                            }
                        </Form>
                      </>
                  )
                }
              </View>
              <View style={{ flex: 0.5, justifyContent: 'flex-end', }}>
                <InfoModal isVisible={isErrModal} message={serviceError} 
                  handleAccept={toggleErrModal} buttonText={(serviceError === PENDING_VALIDATION_MESSAGE) ? 'CONTINUAR' : 'ACEPTAR'} />
                
                <Button testID={"btnSendRegistration"} accessibilityLabel={"btnSendRegistration"}
                    onPress= {() => handleSend()}
                    disabled={!handleForm()}
                  style={[styles.button, genericStyles.btnShadow, { backgroundColor: !handleForm() ? '#FDE1D3' : '#F16921', borderColor: '#F16820', margin: 24 }]}
                >
                  <Text testID={"lblBtnSendRegistration"} accessibilityLabel={"lblBtnSendRegistration"}
                        style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', borderRadius: 4}}>REGISTRARME</Text>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}