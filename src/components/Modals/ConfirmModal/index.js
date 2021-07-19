import React from "react";
import { Text, Button} from "native-base";
import { View } from "react-native";
import Modal from 'react-native-modal';

import genericStyles from '../../../styles';
import styles from './style';

export default function ConfirmModal({isVisible=false, message='', handleAccept, handleCancel}) {

    return (
        <View>
            <Modal isVisible={isVisible}>
                <View style={styles.contentModal}>
                    <View>
                        <Text style={styles.contentTitleModal}>{message}</Text>
                    </View>
                    <View style={styles.btnsContainer}>
                        <Button testID={"btnConfirmModal"}
                            accessibilityLabel={"btnConfirmModal"} 
                            onPress={handleAccept} style={[styles.btnAccept, genericStyles.btnShadow]}
                        >
                            <Text style={{flex: 1, textAlign: 'center'}}>Aceptar</Text>
                        </Button>
                        <Button testID={"btnCancelModal"} 
                            accessibilityLabel={"btnCancelModal"} 
                            onPress={handleCancel} style={[styles.btnCancel, genericStyles.btnShadow]}
                        >
                            <Text style={{flex: 1, textAlign: 'center'}}>Cancelar</Text>
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
