import React, { useEffect, useState, useRef } from "react";
import { Image, View, SafeAreaView, KeyboardAvoidingView, ScrollView } from "react-native";
import {Button, Text, Form, Item, Input, Icon, Spinner} from "native-base";
import {RadioButton} from 'react-native-paper';
import {TextInputMask} from 'react-native-masked-text';
import genericStyles from '../../styles';

import styles from './style'

import { buildDomain, buildErrMssg } from '../../utils';

import {getExecutive} from '../../redux/api/executive';

import {requestUserDomain} from '../../redux/api/company';

import InfoModal from "../../components/Modals/InfoModal";
import {
    REGISTRATION_END,
    DEFAULT_GENDER,
    MALE_GENDER,
    FEMALE_GENDER,
    WRONG_CUIL,
    INVALID_DOMAIN,
    LOGIN,
    REGISTERED_EMAIL,
    EMAIL_NOTIFICATION, REGISTRATION_BEGIN, PENDING_VALIDATION_MESSAGE
} from "../../consts";

export default function RegistrationBegin({ route, navigation }) {

    const keepValues = (route.params) ? route.params.goBack : false;

    const [gender, setGender] = useState(DEFAULT_GENDER);
    const [cuil, setCUIL] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [areaCode, setAreaCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [errMssgCUIL, setErrMssgCUIL] = useState("");
    const [errMssgCountryCode, setErrMssgCountryCode] = useState("");
    const [errMssgPhone, setErrMssgPhone] = useState("");
    const [errMssgEmail, setErrMssgEmail] = useState("");
    const [isErrModal, setIsErrModal] = useState(false);
    const [serviceError, setServiceError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const nameInput = useRef(null);
    const lastNameInput = useRef(null);
    const countryCodeInput = useRef(null);
    const areaCodeInput = useRef(null);
    const phoneInput = useRef(null);
    const emailInput = useRef(null);

    useEffect(() => {
        return function cleanUp() {
        };
    }, [])

    /* useEffect(() => {
         BackHandler.addEventListener("hardwareBackPress", handleGoBack);
 
         return () => {
             BackHandler.removeEventListener("hardwareBackPress", handleGoBack);
         };
     });*/

    useEffect(() => {
        if (!keepValues) {
            clearAll();
        }
    }, [keepValues])

    const clearErrMssg = () => {
        setErrMssgCUIL("");
        setErrMssgCountryCode("");
        setErrMssgPhone("");
        setErrMssgEmail("");
    }

    const clearAll = () => {
        clearErrMssg();
        setGender(DEFAULT_GENDER);
        setCUIL("");
        setFirstName("");
        setLastName("");
        setCountryCode("");
        setAreaCode("");
        setPhoneNumber("");
        setEmail("");
        setServiceError("");
    }

    const handleChangeCUIL = (text) => {
        setErrMssgCUIL("");
        setCUIL(text);
    }

    const handleChangeFirstName = (text) => {
        if (text.substring(0, 1) === " ") {
            text = text.substring(1);
        }

        text = text.replace('  ', ' ');

        setFirstName(text);
    }

    const handleChangeLastName = (text) => {
        if (text.substring(0, 1) === " ") {
            text = text.substring(1);
        }

        text = text.replace('  ', ' ');

        setLastName(text);
    }

    const handleChangeCountryCode = (text) => {
        setErrMssgCountryCode("");

        if (text.substring(1, 2) === "0") {
            setCountryCode("+" + text.substring(2));
        } else {
            setCountryCode(text);
        }
    }

    const handleChangeAreaCode = (text) => {
        setErrMssgPhone("");
        if (text.substring(0, 1) === "0") {
            setAreaCode(text.substring(1));
        } else {
            setAreaCode(text);
        }
    }

    const handleChangePhoneNumber = (text) => {
        setErrMssgPhone("");
        setPhoneNumber(text);
    }

    const buildFullPhone = (country, area, phone) => {
        if (country === "+54") {
            return `${country.trim()} 9 ${area.trim()} ${phone.trim()}`;
        }
        return `${country.trim()} ${area.trim()} ${phone.trim()}`;
    }

    const handleChangeEmail = (text) => {
        setErrMssgEmail("");
        setEmail(text.trim());
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

    const validateEmptyInputs = (mssg) => {
        if (mssg.cuil || mssg.countryCode || mssg.phoneNumber || mssg.email) {
            setErrMssgCUIL(mssg.cuil)
            setErrMssgCountryCode(mssg.countryCode);
            setErrMssgPhone(mssg.phoneNumber);
            setErrMssgEmail(mssg.email);
            return
        }
        return true
    }

    const handleNext = async() => {
        clearErrMssg();
        let form = { gender, cuil, countryCode, areaCode, phoneNumber, email };
        let mssg = buildErrMssg(form);
        if (!validateEmptyInputs(mssg)) return
        try {
            setLoading(true);
            const executive = await getExecutive({email});
            if (executive && executive.length > 0) {
                handleExistingExecutive(executive);
            } else {
                await validateDomain();
            }
        } catch (error) {
            setServiceError(error.message);
            setIsErrModal(true);
        }finally{
            setLoading(false);
        }
    }

    const handleExistingExecutive = (executive) => {
        if(!executive[0].valid && executive[0].active){
            setServiceError(PENDING_VALIDATION_MESSAGE);
            setIsErrModal(true);
        } else {
            setErrMssgEmail(REGISTERED_EMAIL);
        }
    }

    const validateDomain = async() => {
        try {
            setLoading(true);
            const domain = buildDomain(email);
            const company = await requestUserDomain({domain});
            if (company.length === 0) {
                setErrMssgEmail(INVALID_DOMAIN);
                return
            } else {
                let fullPhone = buildFullPhone(countryCode, areaCode, phoneNumber);
                const params = {lastName, firstName, email, cuil, gender, fullPhone};
                navigation.navigate(REGISTRATION_END, params);
            }
        } catch (error) {
            throw new Error(error.message);
        }finally{
            setLoading(false);
        }
    }

    const handleGoBack = () => {
        clearAll();
        navigation.reset({
            index: 0,
            routes: [{name: LOGIN}]
        });
    }

    const handleForm = () => {
        if (cuil.trim() === '' || firstName.trim() === '' || lastName.trim() === '' || countryCode.trim() === '' || phoneNumber.trim() === '' || areaCode.trim() === '' || email.trim() === '') {
            return false;
        } 
        return true;
    }

    const setPhoneMask = (country, area) => {
        if (country.trim() === "+54") {
            if (area.trim().length === 2) {
                return '9999-9999';
            } else if (area.trim().length === 3) {
                return '999-9999';
            } else if (area.trim().length === 4) {
                return '999-999';
            } else {
                return '9999-9999';
            }
        } else {
            return '9999-9999'
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "height"}
                                  keyboardVerticalOffset={Platform.OS == "ios" ? 0 : -100}>
                <ScrollView keyboardShouldPersistTaps='always' style={{flex: 1,}}>
                    <View style={{minHeight: 700}}>
                        <View style={{backgroundColor: '#7a7e7f', justifyContent: 'center', minHeight: 200}}>
                            <View style={{alignItems: 'flex-start', top: -20,}}>
                                <Icon testID={"backButtonRegistrationBegin"} accessibilityLabel={"backButtonRegistrationBegin"}
                                      style={{marginLeft: 24, color: '#fff'}} size={24} name="arrow-back"
                                      onPress={handleGoBack}/>
                            </View>
                            <View style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center',}}>
                                <Image testID={"imgLogoRegistrationBegin"} accessibilityLabel={"imgLogoRegistrationBegin"}
                                       source={require('../../../assets/ase_nacional_imagen_app.png')}
                                       style={{width: 180, height: 60}}/>
                            </View>
                        </View>
                        {
                            (loading) ? (
                                <Spinner color="#f16921"></Spinner>
                            ) : (
                                <View style={{backgroundColor: 'white', flex: 1, alignContent: 'center',}}>
                                    <View style={{margin: 10}}>
                                        <Text testID={"titleRegistrationBegin"} accessibilityLabel={"titleRegistrationBegin"}
                                              style={{textAlign: 'center', margin: 10, fontWeight: 'bold',}}>REGISTRO
                                            1/2</Text>
                                        <Text testID={"txtParagraphOneRegistrationBegin"} accessibilityLabel={"txtParagraphOneRegistrationBegin"}
                                              style={{margin: 10, fontSize: 12}}>Bienvenido a la App de ventas de ASE.
                                            Creando tu cuenta podrás realizar las consultas, acelerar el proceso de alta
                                            de nuevos beneficiarios enviando la info y obteniendo respuesta en pocos
                                            minutos.</Text>
                                        <Text testID={"txtParagraphTwoRegistrationBegin"} accessibilityLabel={"txtParagraphTwoRegistrationBegin"}
                                              style={{margin: 10, fontSize: 12}}>Registrate con unos pocos datos y
                                            comenzá a disfrutar de los beneficios de ASE Ventas.</Text>
                                        <Form>
                                            <Item last style={{marginLeft: 10, marginRight: 10}}>
                                                <View style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    padding: 5,
                                                    marginLeft: -10
                                                }}>
                                                        <Text testID={"lblSex"} accessibilityLabel={"lblSex"}>Género</Text>
                                                    <View style={{
                                                        flex: 1,
                                                        flexDirection: 'row',
                                                        justifyContent: 'flex-end',
                                                        alignItems: 'center',
                                                        alignContent: 'flex-end',
                                                        paddingRight: 16,
                                                    }}>
                                                        <RadioButton testID={"radioBtnMale"}
                                                                     accessibilityLabel={"radioBtnMale"} value={gender}
                                                                     status={gender === MALE_GENDER ? 'checked' : 'unchecked'}
                                                                     onPress={() => {
                                                                         setGender(MALE_GENDER)
                                                                     }} color={'#f16820'} uncheckedColor={'black'}/>
                                                        <Text>{MALE_GENDER}</Text>
                                                        <RadioButton testID={"radioBtnFemale"}
                                                                     accessibilityLabel={"radioBtnFemale"}
                                                                     value={gender}
                                                                     status={gender === FEMALE_GENDER ? 'checked' : 'unchecked'}
                                                                     onPress={() => {
                                                                         setGender(FEMALE_GENDER)
                                                                     }} color={'#f16820'} uncheckedColor={'black'}/>
                                                        <Text>{FEMALE_GENDER}</Text>
                                                    </View>
                                                </View>
                                            </Item>
                                            {
                                                    (errMssgCUIL === WRONG_CUIL) ? (
                                                        <>
                                                            <Item style={{
                                                                borderBottomColor: 'red',
                                                                borderBottomWidth: 2,
                                                                marginLeft: 10,
                                                                marginRight: 10
                                                            }}>
                                                                <TextInputMask testID={"inputCUILError"} returnKeyType={'next'}
                                                                               accessibilityLabel={"inputCUILError"}
                                                                               keyboardType="number-pad" type={'custom'}
                                                                               options={{mask: '99-99999999-9'}}
                                                                               value={cuil} onSubmitEditing={() => nameInput.current._root.focus()}
                                                                               onChangeText={text => handleChangeCUIL(text)}
                                                                               placeholder="CUIL" style={{
                                                                    margin: 5,
                                                                    fontSize: 17,
                                                                    justifyContent: 'flex-start',
                                                                    width: '100%',
                                                                    height: '80%',
                                                                    marginTop: 12,
                                                                    marginBottom: 12
                                                                }} placeholderTextColor='dimgrey'/>
                                                            </Item>
                                                            <Item style={{
                                                                borderBottomWidth: 0,
                                                                marginLeft: 10,
                                                                marginRight: 10
                                                            }}>
                                                                <Text testID={"cuilErrorMessage"}
                                                                      accessibilityLabel={"cuilErrorMessage"}
                                                                    style={{ color: 'red' }}>{errMssgCUIL} <Icon
                                                                    style={{color: 'red', fontSize: 20}}
                                                                    name='ios-warning'></Icon></Text>
                                                            </Item>
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                            <Item style={{marginLeft: 10, marginRight: 10}}>
                                                                <TextInputMask testID={"inputCuil"} returnKeyType={'next'}
                                                                               accessibilityLabel={"inputCuil"} 
                                                                               keyboardType="number-pad" type={'custom'}
                                                                               options={{mask: '99-99999999-9'}}
                                                                               value={cuil} onSubmitEditing={() => nameInput.current._root.focus()}
                                                                               onChangeText={text => handleChangeCUIL(text)}
                                                                               placeholder="CUIL" style={{
                                                                    margin: 5,
                                                                    fontSize: 17,
                                                                    justifyContent: 'flex-start',
                                                                    width: '100%',
                                                                    marginTop: 12,
                                                                    marginBottom: 12
                                                                }} placeholderTextColor='dimgrey'/>
                                                            </Item>
                                                        </>
                                                    )
                                            }
                                                        <>
                                                            <Item style={{marginLeft: 10, marginRight: 10}}>
                                                                <Input testID={"inputFirstname"} returnKeyType={'next'}
                                                                    accessibilityLabel={"inputFirstname"} onSubmitEditing={() => lastNameInput.current._root.focus()}
                                                                    placeholder="Nombre" value={firstName} maxLength={50}
                                                                    onChangeText={text => handleChangeFirstName(text)}
                                                                    ref={nameInput}
                                                                />
                                                            </Item>
                                                        </>
                                                        <>
                                                            <Item style={{marginLeft: 10, marginRight: 10}}>
                                                                <Input testID={"inputLastname"} returnKeyType={'next'}
                                                                    accessibilityLabel={"inputLastname"} onSubmitEditing={() => countryCodeInput.current._inputElement.focus()}
                                                                    placeholder="Apellido" value={lastName}
                                                                    maxLength={50}
                                                                    onChangeText={text => handleChangeLastName(text)} 
                                                                    ref={lastNameInput}/>
                                                            </Item>
                                                        </>
                                            {
                                                    (errMssgCountryCode || errMssgPhone) ? (
                                                        <>
                                                            <Item style={{borderBottomColor:'red', borderBottomWidth:2, marginRight: 10, marginBottom: 10, marginLeft: 10}}>
                                                                <>
                                                                    <Item>
                                                                        <TextInputMask
                                                                            ref={countryCodeInput} onSubmitEditing={() => areaCodeInput.current._inputElement.focus()}
                                                                            testID={"inputCountryCode"} accessibilityLabel={"inputCountryCode"}
                                                                            keyboardType="phone-pad" type={'custom'} returnKeyType={'next'}
                                                                            options={{ mask: '+9999' }} value={countryCode}
                                                                            onChangeText={text => handleChangeCountryCode(text)}
                                                                            placeholder="Cód. país" placeholderTextColor='dimgrey'
                                                                            style={{
                                                                                marginTop: 12, marginLeft: 5, marginBottom: 10,
                                                                                fontSize: 17,
                                                                                justifyContent: 'flex-start',
                                                                                flex: 0.5
                                                                            }}
                                                                        />
                                                                        <TextInputMask ref={areaCodeInput} onSubmitEditing={() => phoneInput.current._inputElement.focus()}
                                                                            testID={"inputAreaCode"} accessibilityLabel={"inputAreaCode"}
                                                                            keyboardType="phone-pad" type={'custom'} returnKeyType={'next'}
                                                                            options={{ mask: '9999' }} value={areaCode}
                                                                            onChangeText={text => handleChangeAreaCode(text)}
                                                                            placeholder="Cód. área" placeholderTextColor='dimgrey'
                                                                            style={{
                                                                                marginTop: 12, marginLeft: 5, marginBottom: 10,
                                                                                fontSize: 17,
                                                                                justifyContent: 'flex-start',
                                                                                flex: 0.5
                                                                            }}
                                                                        />
                                                                        <TextInputMask ref={phoneInput} onSubmitEditing={() => emailInput.current._root.focus()}
                                                                            testID={"inputPhone"} accessibilityLabel={"inputPhone"}
                                                                            keyboardType="phone-pad" type={'custom'} returnKeyType={'next'}
                                                                            options={{ mask: setPhoneMask(areaCode) }}
                                                                            value={phoneNumber}
                                                                            onChangeText={text => handleChangePhoneNumber(text)}
                                                                            placeholder="Teléfono" placeholderTextColor='dimgrey'
                                                                            style={{
                                                                                marginTop: 12, marginLeft: 5, marginBottom: 10,
                                                                                fontSize: 17,
                                                                                justifyContent: 'flex-start',
                                                                                flex: 1
                                                                            }}
                                                                        />

                                                                    </Item>
                                                                </>
                                                            </Item>
                                                            <Item style={{borderBottomWidth:0, marginLeft: 10, marginRight: 10}}>
                                                                <Text testID={"phoneErrorMessage"} accessibilityLabel={"phoneErrorMessage"} style={{ color: 'red' }}>{errMssgCountryCode || errMssgPhone} <Icon style={{ color: 'red', fontSize: 20 }} name='ios-warning'></Icon></Text>
                                                            </Item>
                                                        </>
                                                    )
                                                    :(
                                                        <>
                                                            <Item style={{marginLeft: 10, marginRight: 10}}>
                                                                    <TextInputMask
                                                                        ref={countryCodeInput} onSubmitEditing={() => areaCodeInput.current._inputElement.focus()}
                                                                    testID={"inputCountryCode"} accessibilityLabel={"inputCountryCode"}
                                                                    keyboardType="phone-pad" type={'custom'} returnKeyType={'next'}
                                                                    options={{ mask: '+9999' }} value={countryCode}
                                                                    onChangeText={text => handleChangeCountryCode(text)}
                                                                    placeholder="Cód. país" placeholderTextColor='dimgrey'
                                                                    style={{
                                                                        marginTop: 12, marginLeft: 5, marginBottom: 10,
                                                                        fontSize: 17,
                                                                        justifyContent: 'flex-start',
                                                                        flex: 0.5
                                                                    }}
                                                                />
                                                                <TextInputMask ref={areaCodeInput} onSubmitEditing={() => phoneInput.current._inputElement.focus()}
                                                                    testID={"inputAreaCode"} accessibilityLabel={"inputAreaCode"}
                                                                    keyboardType="phone-pad" type={'custom'} returnKeyType={'next'}
                                                                    options={{ mask: '9999' }} value={areaCode}
                                                                    onChangeText={text => handleChangeAreaCode(text)}
                                                                    placeholder="Cód. área" placeholderTextColor='dimgrey'
                                                                    style={{
                                                                        marginTop: 12, marginBottom: 10,
                                                                        fontSize: 17,
                                                                        justifyContent: 'flex-start',
                                                                        flex: 0.5
                                                                    }}
                                                                />
                                                                <TextInputMask ref={phoneInput} returnKeyType={'next'}
                                                                    testID={"inputPhone"} accessibilityLabel={"inputPhone"}
                                                                    keyboardType="phone-pad"
                                                                    type={'custom'} onSubmitEditing={() => emailInput.current._root.focus()}
                                                                    options={{ mask: setPhoneMask(countryCode, areaCode) }}
                                                                    value={phoneNumber}
                                                                    onChangeText={text => handleChangePhoneNumber(text)}
                                                                    placeholder="Teléfono" placeholderTextColor='dimgrey'
                                                                    style={{
                                                                        marginTop: 12, marginBottom: 10,
                                                                        fontSize: 17,
                                                                        justifyContent: 'flex-start',
                                                                        flex: 1
                                                                    }}
                                                                />

                                                            </Item>
                                                        </>
                                                    )
                                            }
                                            {
                                                    (errMssgEmail) ? (
                                                        <>
                                                            <Item style={{
                                                                borderBottomColor: 'red',
                                                                borderBottomWidth: 2,
                                                                marginLeft: 10,
                                                                marginRight: 10
                                                            }}>
                                                                <Input testID={"inputEmail"} ref={emailInput}
                                                                       accessibilityLabel={"inputEmail"}
                                                                       keyboardType="email-address" placeholder="Mail"
                                                                       value={email} maxLength={75}
                                                                       onChangeText={text => handleChangeEmail(text)}/>
                                                            </Item>
                                                            <Item style={{
                                                                borderBottomWidth: 0,
                                                                marginLeft: 10,
                                                                marginRight: 10
                                                            }}>
                                                                <Text testID={"inputEmailError"}
                                                                      accessibilityLabel={"inputEmailError"}
                                                                    style={{ color: 'red' }}>{errMssgEmail} <Icon
                                                                    style={{color: 'red', fontSize: 20}}
                                                                    name='ios-warning'></Icon></Text>
                                                            </Item>
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                            <Item style={{marginLeft: 10, marginRight: 10}}>
                                                                <Input testID={"inputEmail"} ref={emailInput}
                                                                       accessibilityLabel={"inputEmail"}
                                                                       keyboardType="email-address" placeholder="Mail"
                                                                       value={email} maxLength={75}
                                                                       onChangeText={text => handleChangeEmail(text)}/>
                                                            </Item>
                                                        </>
                                                    )
                                            }
                                        </Form>
                                    </View>
                                    <View style={{margin: 10,}}>
                                        <InfoModal isVisible={isErrModal} message={serviceError} 
                                                handleAccept={toggleErrModal} buttonText={(serviceError === PENDING_VALIDATION_MESSAGE) ? 'CONTINUAR' : 'ACEPTAR'} />
                                        <Button testID={"btnNext"} accessibilityLabel={"btnNext"}
                                            onPress={handleNext}
                                            disabled={!handleForm()}
                                                style={[styles.button, genericStyles.btnShadow, {
                                                backgroundColor: !handleForm() ? '#FDE1D3' : '#F16921',
                                                borderColor: '#F16820',
                                                margin: 24
                                            }]}
                                        >
                                                <Text testID={"lblBtnNext"} accessibilityLabel={"lblBtnNext"} style={{
                                                flex: 1,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                borderRadius: 4
                                                }}>SIGUIENTE</Text>
                                        </Button>
                                    </View>
                                </View>
                            )
                        }
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}