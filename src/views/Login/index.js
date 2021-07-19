import React, { useEffect, useState, useCallback, useRef } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from "react-redux";
import {
    Image, TouchableOpacity, SafeAreaView, KeyboardAvoidingView,
    ScrollView, View, Platform, Dimensions
} from "react-native";
import { Text, Button, Form, Item, Input, Spinner, Icon, Footer } from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Constants from "expo-constants";
import genericStyles from '../../styles';

import styles from "./style";

import InfoModal from "../../components/Modals/InfoModal";
import { PASSWORD_RECOVERY, REGISTRATION_BEGIN, EMPTY_PASSWORD, EMPTY_USERNAME,
    WRONG_USER_PASSWORD_MESSAGE, ACCESS_TOKEN, USER_DATA, PENDING_VALIDATION_MESSAGE, 
    LOGIN, EMAIL_NOTIFICATION, TERMS_AND_CONDITIONS, FREQUENT_QUESTIONS } from "../../consts";
import { buildErrMssg, getItem, eraseItem } from "../../utils";

import { setInitialStateCompany } from "../../redux/ducks/companyDucks";
import { setInitialStateIntegration } from "../../redux/ducks/integrationDucks";
import { setInitialStateWorkflow } from "../../redux/ducks/workflowDucks";
import { fetchClearNotAcceptedTerms, login, setInitialStateAuthenticate } from '../../redux/ducks/authenticateDucks';

export default function Login({ navigation }) {
    const dispatch = useDispatch();

    const error = useSelector(store => store.authentication.error);
    const loading = useSelector(store => store.authentication.loading);
    const acceptedTerms = useSelector(store => store.authentication.acceptedTerms);

    const { height } = Dimensions.get('window');

    const passwordInput = useRef(null);

    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [eye, setEye] = useState('md-eye');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMssg, setErrMssg] = useState('');
    const [isErrModal, setIsErrModal] = useState(false);
    const [serviceError, setServiceError] = useState("");
    const [unmounted, setUnmounted] = useState(false);
    const version = Constants.manifest.version;

    useEffect(() => {
        return function cleanUp() {
            setUnmounted(true);
        };
    }, [])

    useEffect(() => {
        if (!unmounted) {
            getUserData();
        }
    }, [unmounted])

    useFocusEffect(
        useCallback(() => {
            cleanStoreStates()
            cleanToken();
            clearAll();
        }, [])
    );

    useEffect(() => {
        if(acceptedTerms === false){
            dispatch(fetchClearNotAcceptedTerms());
            navigation.navigate(TERMS_AND_CONDITIONS);
        }
    }, [acceptedTerms])

    useEffect(() => {
        if (error) {
            if (error.includes(WRONG_USER_PASSWORD_MESSAGE)) {
                setErrMssg(error);
            } else {
                setServiceError(error);
                setIsErrModal(true);
            }
            dispatch(setInitialStateAuthenticate());
        }
    }, [error]);

    const getUserData = async () => {
        try {
            const userDB = await getItem(USER_DATA);
            if (userDB) {
                const user = JSON.parse(userDB);
                setUsername(user.email);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const cleanStoreStates = () => {
        dispatch(setInitialStateCompany());
        dispatch(setInitialStateIntegration());
        dispatch(setInitialStateWorkflow());
        dispatch(setInitialStateAuthenticate());
    };

    const cleanToken = async () => {
        try {
            const token = await getItem(ACCESS_TOKEN);
            if (token) {
                await eraseItem(ACCESS_TOKEN);
            }
        } catch (err) {
            console.log('error ' + err);
        }
    };

    const clearAll = () => {
        setErrMssg("");
        setPassword("");
        setEye('md-eye');
    };

    const handleLoginPress = async () => {
        setErrMssg("");
        let form = { username, password }
        const mssg = buildErrMssg(form);
        if (mssg.username || mssg.password) {
            setErrMssg(mssg.username || mssg.password);
            return;
        }
        dispatch(login({ email: username, password: password }));
    };

    const handleTouchableOpacity = async () => {
        const eyeName = secureTextEntry ? 'md-eye-off' : 'md-eye';
        setSecureTextEntry(!secureTextEntry);
        setEye(eyeName);
    };

    const handleChangeUsername = (text) => {
        setUsername(text);
        setErrMssg('');
    };

    const handleChangePassword = (text) => {
        setPassword(text);
        setErrMssg('');
    };

    const handleRegistry = () => {
        navigation.navigate(REGISTRATION_BEGIN);
    };

    const handlePasswordRecovery = () => {
        navigation.navigate(PASSWORD_RECOVERY);
    };

    const handleQuestionFrequently = () => {
        let params = {};
        params.sourceView = LOGIN;
        navigation.navigate(FREQUENT_QUESTIONS, params)
    }

    const toggleErrModal = () => {
        setIsErrModal(false);
        if (serviceError.includes(PENDING_VALIDATION_MESSAGE)) {
            validateUser();
        } else {
            clearAll();
        }
    };

    const validateUser = () => {
        let params = {};
        params.sourceView = LOGIN;
        params.email = username;
        navigation.navigate(EMAIL_NOTIFICATION, params);
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS == "ios" ? 50 : -100}>
                <ScrollView keyboardShouldPersistTaps='always' style={styles.scrollView} bounces={false}>
                    <View style={{ backgroundColor: 'green', minHeight: height - Constants.statusBarHeight }}>
                        <View style={{ backgroundColor: '#7a7e7f', flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', }}>
                            <Image testID={"imgLogin"} accessibilityLabel={"imgLogin"} source={require('../../../assets/ase_nacional_imagen_app.png')} style={{ width: 180, height: 60 }} />
                        </View>
                        <View style={{ backgroundColor: 'white', flex: 0.4, justifyContent: 'center', alignContent: 'center', }}>
                            <View style={{ margin: 10 }}>
                                {
                                    (loading) ? (
                                        <Spinner color="#f16921"></Spinner>
                                    ) : (
                                            <>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginRight: 10, width: '100%'}}>
                                                    <View style={{ alignItems:'center', width: '90%'}}>
                                                        <Text testID={"titleLogin"} accessibilityLabel={"titleLogin"} style={{ textAlign: 'center', fontWeight: 'bold' }}>INGRESO</Text>
                                                    </View>
                                                    <View style={{ width:'10%', alignItems: 'flex-end' }}>
                                                        <AntDesign name="questioncircleo" size={26} color="#f16921" onPress={handleQuestionFrequently} testID={'btnFrequentQuestions'} />
                                                    </View>
                                                </View>
                                                <Form>
                                                    {
                                                        (errMssg === EMPTY_USERNAME || errMssg === WRONG_USER_PASSWORD_MESSAGE) ?
                                                            (
                                                                <>
                                                                    <Item style={{ borderBottomColor: 'red', borderBottomWidth: 2 }}>
                                                                        <Input testID={"inputUsername"} accessibilityLabel={"inputUsername"} keyboardType="email-address" placeholder="Usuario" value={username} onChangeText={text => handleChangeUsername(text)} />
                                                                    </Item>
                                                                    <Item style={{ borderBottomWidth: 0 }}>
                                                                        <Text testID={"credentialsErrorMessage"} accessibilityLabel={"credentialsErrorMessage"} style={{ color: 'red' }}>{errMssg} <Icon style={{ color: 'red', fontSize: 20 }} name='ios-warning'></Icon></Text>
                                                                    </Item>
                                                                </>
                                                            ) :
                                                            (
                                                                <Item>
                                                                    <Input testID={"inputUsername"} accessibilityLabel={"inputUsername"} keyboardType="email-address" placeholder="Usuario" value={username} returnKeyType={'next'} onChangeText={text => handleChangeUsername(text)} onSubmitEditing={() => passwordInput.current._root.focus()}/>
                                                                </Item>
                                                            )
                                                    }
                                                    {
                                                        (errMssg === EMPTY_PASSWORD) ?
                                                            (
                                                                <>
                                                                    <Item style={{ borderBottomColor: 'red', borderBottomWidth: 2 }}>
                                                                        <Input testID={"inputPasswordLoginError"} accessibilityLabel={"inputPasswordLoginError"} placeholder="Clave" value={password} onChangeText={text => handleChangePassword(text)} secureTextEntry={secureTextEntry} />
                                                                        <TouchableOpacity onPress={handleTouchableOpacity}>
                                                                            <Ionicons testID={"btnEyesPasswordLogin"} accessibilityLabel={"btnEyesPasswordLogin"} name={eye} size={24} color="gray" />
                                                                        </TouchableOpacity>
                                                                    </Item>
                                                                    <Item style={{ borderBottomWidth: 0 }}>
                                                                        <Text testID={"emptyPasswordErrorMessage"} accessibilityLabel={"emptyPasswordErrorMessage"} style={{ color: 'red' }}>{errMssg} <Icon style={{ color: 'red', fontSize: 20 }} name='ios-warning'></Icon></Text>
                                                                    </Item>
                                                                </>
                                                            ) :
                                                            (
                                                                <>
                                                                    <Item>
                                                                        <Input testID={"inputPasswordLogin"} accessibilityLabel={"inputPasswordLogin"} value={password} placeholder="Clave" onChangeText={text => handleChangePassword(text)} secureTextEntry={secureTextEntry} ref={passwordInput} />
                                                                        <TouchableOpacity onPress={handleTouchableOpacity}>
                                                                            <Ionicons testID={"btnEyesPasswordLogin"} accessibilityLabel={"btnEyesPasswordLogin"} name={eye} size={24} color="gray" />
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
                            <View style={{ margin: 10 }}>
                                <InfoModal isVisible={isErrModal} message={serviceError} handleAccept={toggleErrModal} 
                                    buttonText={(serviceError === PENDING_VALIDATION_MESSAGE) ? 'CONTINUAR' : 'ACEPTAR'}/>

                                <Button warning style={[genericStyles.btnShadow, { margin: 10, backgroundColor: '#f16921', borderRadius: 4 }]} onPress={handleLoginPress} disabled={loading}>
                                    <Text testID={"btnLogin"} accessibilityLabel={"btnLogin"} style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>INICIAR SESIÓN</Text>
                                </Button>

                                <Button light style={[genericStyles.btnShadow, { margin: 10, backgroundColor: 'gray', borderRadius: 4 }]} onPress={handleRegistry} disabled={loading}>
                                    <Text testID={"btnRegistration"} accessibilityLabel={"btnRegistration"} style={{ color: 'white', flex: 1, textAlign: 'center', fontWeight: 'bold' }}>NO TENGO CUENTA</Text>
                                </Button>

                                <Button dark bordered warning style={{ margin: 10, borderColor: 'orange', borderRadius: 4 }} onPress={handlePasswordRecovery} disabled={loading}>
                                    <Text testID={"btnPasswordRecovery"} accessibilityLabel={"btnPasswordRecovery"} style={{ color: '#f16921', flex: 1, textAlign: 'center', fontWeight: 'bold' }}>OLVIDÉ MI CLAVE</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <Footer style={styles.footer}>
                    <Text style={{color: 'black'}} testID={'lblVersion'}> Versión {version}</Text>
                </Footer>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
