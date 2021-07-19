import React from "react";
import { Text, Button} from "native-base";
import { View } from "react-native";
import Modal from 'react-native-modal';

import styles from './style';
import genericStyles from '../../../styles'

export default function EmailModal({isVisible=false, message='',email='' ,buttonText='ACEPTAR', handleAccept}) {
    return (
        <View>
            <Modal isVisible={isVisible}>
                <View style={styles.contentModal}>
                    <Text testID={"messageModal"} accessibilityLabel={"messageModal"} 
                        style={styles.contentTitleModal}
                    >
                        {message} 
                    </Text>
                    <Text testID={"messageEmailModal"} accessibilityLabel={"messageEmailModal"} 
                        style={styles.contentTitleModal}
                    >
                        {email} 
                    </Text>
                    <Button onPress={handleAccept} style={[styles.btnAccept, genericStyles.btnShadow]}>
                        <Text testID={"btnEmailModal"} accessibilityLabel={"btnEmailModal"} >
                            {buttonText}
                        </Text>
                    </Button>
                </View>
            </Modal>
        </View>
    );
}
