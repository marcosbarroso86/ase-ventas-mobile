import React from "react";
import { Text, Button} from "native-base";
import { View } from "react-native";
import Modal from 'react-native-modal';

import styles from './style';
import genericStyles from '../../../styles'

export default function InfoModal({isVisible=false, message='', buttonText='ACEPTAR', handleAccept}) {

    return (
        <View>
            <Modal isVisible={isVisible}>
                <View style={styles.contentModal}>
                    <Text testID={"messageModal"} accessibilityLabel={"messageModal"} 
                        style={styles.contentTitleModal}
                    >
                        {message}
                    </Text>
                    <Button onPress={handleAccept} style={[styles.btnAccept, genericStyles.btnShadow]}>
                        <Text testID={"btnInfoModal"} accessibilityLabel={"btnInfoModal"} >
                            {buttonText}
                        </Text>
                    </Button>
                </View>
            </Modal>
        </View>
    );
}
