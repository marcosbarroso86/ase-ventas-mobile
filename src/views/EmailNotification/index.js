import React, { useState } from "react";
import {
    Image,
    View,
} from 'react-native';
import { Container, Content, Text, Button } from 'native-base';

import styles from './style';
import Toast from 'react-native-root-toast';
import { generatePasswordCode } from '../../redux/api/executive';
import { KEY_ACTIVATION, RESENT_EMAIL } from '../../consts';
import { ScrollView } from "react-native-gesture-handler";
import InfoModal from "../../components/Modals/InfoModal";

export default function EmailNotification({ route, navigation }) {

    const email = (route.params) ? route.params.email : '';
    const sourceView = (route.params) ? route.params.sourceView : '';
    const [isErrModal, setIsErrModal] = useState(false);
    const [serviceError, setServiceError] = useState('');

    const handleSend = async() => {
        const payload = { email };
        try {
            await generatePasswordCode(payload);
            Toast.show(RESENT_EMAIL, {
                duration: Toast.durations.SHORT,
            });
        } catch (error) {
            setIsErrModal(true);
            setServiceError(error.message);
        }
    }

    const handleEntryCode = () => {
        let params= {};
        params.email = email;
        params.sourceView = sourceView;
        navigation.navigate(KEY_ACTIVATION, params);
    }

    const toggleErrModal = () => {
        setIsErrModal(false);
    }


    return (
        <Container>
            <Content contentContainerStyle={styles.content}>
                <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'space-between', width: '75%' }}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
                            <Image testID={"imgLogoEmailNotification"} accessibilityLabel={"imgLogoEmailNotification"}
                                source={require('../../../assets/ase_nacional_imagen_app.png')}
                            style={{ marginTop: 30, width: 180, height: 60, alignSelf: 'center', tintColor: 'white' }} />

                        <View style={{ flexGrow: 1, justifyContent: 'space-around' }}>
                                <Text
                                    testID={"titleEmailNotification"} accessibilityLabel={"titleEmailNotification"}
                                style={{
                                    textAlign: 'center', color: 'white', fontWeight: 'bold', marginTop: 20
                                }}
                                >
                                    MAIL ENVIADO
                                </Text>
                                <Text
                                    testID={"txtParagraphOneEmailNotification"} accessibilityLabel={"txtParagraphOneEmailNotification"}
                                    style={{ color: 'white', textAlign: 'center' }}>
                                    Se envió un mail satisfactoriamente a {email}
                            </Text>
                                <Text
                                    testID={"txtParagraphTwoEmailNotification"} accessibilityLabel={"txtParagraphTwoEmailNotification"}
                                style={{ color: 'white', textAlign: 'center' }}>
                                    Al cabo de unos 10 minutos como máximo deberías recibirlo. Este contiene un código y tiene una vigencia de 24 horas, pasado este período deberás solicitar un nuevo código.</Text>
                                <Text
                                    testID={"txtParagraphThreeEmailNotification"} accessibilityLabel={"txtParagraphThreeEmailNotification"}
                                    style={{ color: 'white', textAlign: 'center' }}>Si no recibiste el mail, solicitalo nuevamente.</Text>
                            </View>
                    </ScrollView>
                </View>
                <InfoModal isVisible={isErrModal} message={serviceError}
                    handleAccept={toggleErrModal} buttonText='ACEPTAR' />
                <Button bordered full
                    style={{ borderColor: 'white', marginTop: 5, marginRight: 24, marginLeft: 24, borderRadius: 4, }}
                        onPress={() => handleEntryCode()}>
                    <Text testID={"btnValidateCodeEmailNotification"} accessibilityLabel={"btnValidateCodeEmailNotification"}
                          style={{ color: 'white', fontWeight: 'bold' }}>VALIDAR CÓDIGO</Text>
                </Button>

                <Button bordered full style={{ borderColor: 'white', marginTop: 10, marginRight: 24, marginBottom: 24, marginLeft: 24, borderRadius: 4, }}  onPress={() => handleSend()}>
                    <Text testID={"btnRequestNewEmailEmailNotification"} accessibilityLabel={"btnRequestNewEmailEmailNotification"}
                          style={{ color: 'white', fontWeight: 'bold' }}>SOLICITAR NUEVO MAIL</Text>
                </Button>

            </Content>
        </Container>
    )

}