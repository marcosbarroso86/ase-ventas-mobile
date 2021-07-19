import React, {useState} from 'react';
import {
    Platform,
    SafeAreaView,
    Dimensions,
    ScrollView,
    Image,
    View,
    KeyboardAvoidingView,
    TouchableOpacity
} from "react-native";
import { Text,  Button, Form, Item, Input, Icon } from "native-base";
import { Ionicons } from '@expo/vector-icons';
import Constants from "expo-constants";

import styles from './style';
import InfoModal from '../../components/Modals/InfoModal';
import {HOME,PASSWORDS_MUST_BE_EQUALS,LOGIN,PASSWORD_ERROR_VALIDATION_MSSG} from '../../consts';

import {validatePassword} from '../../utils';
import {changePassword} from '../../redux/api/executive';

export default function PasswordConfirm({ route, navigation }) {

    const email = (route.params) ? route.params.email : "";

    const { height } = Dimensions.get('window');

    const [eye, setEye] = useState('md-eye');
    const [eyePasswordRepeated, setEyePasswordRepeated] = useState('md-eye');
    const [secureEntry, setSecureEntry] = useState(true);
    const [securePasswordRepeatedEntry, setSecurePasswordRepeatedEntry] = useState(true);
    const [password, setPassword] = useState('');
    const [passwordRepeated, setPasswordRepeated] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [errMssg, setErrMssg] = useState('');
    const [isErrModal, setIsErrModal] = useState(false);
    const [isSuccessModal, setIsSuccessModal] = useState(false);
    const [serviceError, setServiceError] = useState("");

    const handleGoBack = () => {
        navigation.goBack();
    }

    const handleSaveNewPass = async () => {
        let mssgError = '';
        mssgError = validatePassword(password, passwordRepeated);
        if (!mssgError) {
            setErrMssg('');
            let payload = { email, newPassword: password };
            try {
                await changePassword(payload);
                navigation.reset({
                    index: 0,
                    routes: [{ name: LOGIN }]
                });
            } catch (error) {
                setServiceError(error.message);
                setIsErrModal(true);
            }
        } else {
            setErrMssg(mssgError);
        }
        
    }

    const handleChangePassword = (text) => {
        setErrMssg('');
        if (text.trim().length > 7 && passwordRepeated.length > 7) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
        setPassword(text);
    }

    const handleChangePasswordRepeated = (npassword) => {
        setErrMssg('');
        if (npassword.trim().length > 7 && password.length > 7) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
        setPasswordRepeated(npassword);
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

    const toggleErrModal = () => {
        setIsErrModal(false);
    };
    
    const toggleSuccessModal = () => {
        setIsSuccessModal(false);
        setPasswordRepeated("");
        setPassword("");
        navigation.navigate(HOME);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS == "ios" ? 0 : -100}>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ minHeight: height - Constants.statusBarHeight }}>
                        <View style={{ backgroundColor: '#7a7e7f', flex: 1, justifyContent: 'center', }}>
                            <View style={{ alignItems: 'flex-start', top: -20 }}>
                                <Icon testID={"backButtonPasswordConfirm"} accessibilityLabel={"backButtonPasswordConfirm"} style={{ marginLeft: 24, color: '#fff' }} size={24} name="arrow-back" onPress={handleGoBack} />
                            </View>
                            <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginBottom: 16, }}>
                                <Image testID={"imgLogoPasswordConfirm"} accessibilityLabel={"imgLogoPasswordConfirm"} source={require('../../../assets/ase_nacional_imagen_app.png')} style={{ width: 180, height: 60 }} />
                            </View>
                        </View>
                        <View style={{ flex: 0.1, justifyContent: 'center', alignContent: 'center', }}>
                            <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', }}>
                                <Text testID={"titlePasswordConfirm"} accessibilityLabel={"titlePasswordConfirmPasswordConfirm"} style={{ textAlign: 'center', margin: 16, fontWeight: 'bold', }}>CREAR NUEVA CLAVE</Text>
                                <Text testID={"txtParagraphOnePasswordConfirm"} accessibilityLabel={"txtParagraphOne"} style={{ width: '80%', fontSize: 14, textAlign: 'center' }}>Ingresá tu nueva CLAVE y confirmala. {PASSWORD_ERROR_VALIDATION_MSSG}</Text>
                            </View>
                            <Form style={{ margin: 24, }}>

                                {
                                    (errMssg === PASSWORDS_MUST_BE_EQUALS || errMssg === PASSWORD_ERROR_VALIDATION_MSSG) ? (
                                        <>
                                            <Item style={{ borderColor: 'red', borderBottomWidth: 2, marginLeft: 0 }}>
                                                <Input testID={"inputPassword"} accessibilityLabel={"inputPassword"} placeholder="Nueva clave" value={password} onChangeText={handleChangePassword} secureTextEntry={secureEntry} maxLength={32} />
                                                <TouchableOpacity onPress={handleTouchableOpacity}>
                                                    <Ionicons testID={"btnEyesPassword"} accessibilityLabel={"btnEyesPassword"} name={eye} size={24} color="gray" />
                                                </TouchableOpacity>
                                            </Item>
                                            <Item style={{ borderColor: 'red', borderBottomWidth: 2, marginLeft: 0 }}>
                                                <Input testID={"inputPasswordRepeat"} accessibilityLabel={"inputPasswordRepeat"} placeholder="Repetir clave" contextMenuHidden={true} value={passwordRepeated} onChangeText={handleChangePasswordRepeated} secureTextEntry={securePasswordRepeatedEntry} maxLength={32} />
                                                <TouchableOpacity onPress={handleTouchableOpacityPasswordRepeated}>
                                                    <Ionicons testID={"btnEyesPasswordRepeated"} accessibilityLabel={"btnEyesPasswordRepeated"} name={eyePasswordRepeated} size={24} color="gray" />
                                                </TouchableOpacity>
                                            </Item>
                                            <Item style={{ borderBottomWidth: 0, marginLeft: 0 }}>
                                                <Text testID={"inputPasswordError"} accessibilityLabel={"inputPasswordError"} style={{ color: 'red' }}>{errMssg} <Icon style={{ color: 'red', fontSize: 20 }} name='ios-warning'></Icon></Text>
                                            </Item>
                                        </>
                                    ) : (
                                            <>
                                                <Item style={{ marginLeft: 0 }}>
                                                    <Input testID={"inputPassword"} accessibilityLabel={"inputPassword"} placeholder="Nueva clave" value={password} onChangeText={handleChangePassword} secureTextEntry={secureEntry} maxLength={32} />
                                                    <TouchableOpacity onPress={handleTouchableOpacity}>
                                                        <Ionicons testID={"btnEyesPassword"} accessibilityLabel={"btnEyesPassword"} name={eye} size={24} color="gray" />
                                                    </TouchableOpacity>
                                                </Item>
                                                <Item style={{ marginLeft: 0 }}>
                                                    <Input testID={"inputPasswordRepeat"} accessibilityLabel={"inputPasswordRepeat"} placeholder="Repetir clave" contextMenuHidden={true} value={passwordRepeated} onChangeText={handleChangePasswordRepeated} secureTextEntry={securePasswordRepeatedEntry} maxLength={32} />
                                                    <TouchableOpacity onPress={handleTouchableOpacityPasswordRepeated}>
                                                        <Ionicons testID={"btnEyesPasswordRepeated"} accessibilityLabel={"btnEyesPasswordRepeated"} name={eyePasswordRepeated} size={24} color="gray" />
                                                    </TouchableOpacity>
                                                </Item>
                                            </>
                                        )
                                }
                            </Form>
                        </View>
                        <View style={{ flex: 0.1, justifyContent: 'flex-end', margin: 32 }}>
                            <InfoModal isVisible={isErrModal} message={serviceError}
                                handleAccept={toggleErrModal} />
                            
                            <InfoModal isVisible={isSuccessModal} message="La clave se ha actualizado correctamente."
                                handleAccept={toggleSuccessModal} />

                            <Button testID={"btnSavePassword"} accessibilityLabel={"btnSavePassword"} style={!disabled ? { backgroundColor: '#F16921', borderColor: '#f16820' } : { backgroundColor: '#FDE1D3', borderColor: '#f16820' }} onPress={handleSaveNewPass} disabled={disabled} >
                                <Text testID={"lblBtnSavePassword"} accessibilityLabel={"lblBtnSavePassword"} style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>GUARDAR NUEVA CLAVE</Text>
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}