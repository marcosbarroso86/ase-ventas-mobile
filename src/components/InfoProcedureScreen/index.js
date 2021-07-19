import React from 'react';
import { Text, Button} from "native-base";
import { View, StyleSheet } from "react-native";

export default function InfoProcedure({navigation}) {

    const handleNavigation = (navigationRoute) => {
        navigation.navigate(navigationRoute);
    }

    const styles = StyleSheet.create({
        parentContent: { flex: 1, backgroundColor: '#000000DD', height: '100%', width: '100%', opacity: 100 },
        mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
        titleText: { color: 'white', margin: 24, fontWeight: 'bold', fontSize: 16 },
        bodyText: { color: 'white', margin: 10, width: '75%' },
        button: { borderColor: 'white', margin: 16, borderRadius: 4 },
        buttonLabel: { color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }
    });

    return (
        <View style={styles.parentContent}>
            <View style={styles.mainContent}>
                <Text testID={"txtTitle"} accessibilityLabel={"txtTitle"} style={styles.titleText}>CÓMO UTILIZAR LA APP ASE VENTAS</Text>
                <Text testID={"txtStepOne"} accessibilityLabel={"txtStepOne"} style={styles.bodyText}>1) Buscá la empresa por nombre o CUIT, o cargá el CUIT de la empresa.</Text>
                <Text testID={"txtStepTwo"} accessibilityLabel={"txtStepTwo"} style={styles.bodyText}>2) Determiná si vas a cargar varias altas para la misma empresa.</Text>
                <Text testID={"txtStepThree"} accessibilityLabel={"txtStepThree"} style={styles.bodyText}>3) Ingresá el CUIL de la persona.</Text>
                <Text testID={"txtStepFour"} accessibilityLabel={"txtStepFour"} style={styles.bodyText}>4) Sacá o cargá una foto del formulario 01.</Text>
                <Text testID={"txtStepFive"} accessibilityLabel={"txtStepFive"} style={styles.bodyText}>5) Enviá la gestión y LISTO! Pronto te responderán desde el BackOffice ASE.</Text>
                <Text testID={"txtExtraInfo"} accessibilityLabel={"txtExtraInfo"} style={styles.bodyText}>Otras funciones: Seguí el estado de tus gestiones y consultá las notificaciones del sistema.</Text>
            </View>
            <View>
                <Button testID={"btnReturn"} accessibilityLabel={"btnReturn"} bordered full style={styles.button} onPress={() => handleNavigation('UploadProcedure')}>
                    <Text testID={"lblBtnReturn"} accessibilityLabel={"lblBtnReturn"} style={styles.buttonLabel}>VOLVER</Text>
                </Button>
            </View>
        </View>
    )
}
