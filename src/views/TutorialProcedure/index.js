import React from "react";
import { Text, Button} from "native-base";
import { View, TouchableOpacity } from "react-native";

import {UPLOAD_PROCEDURE} from '../../consts';

export default function TutorialProcedure({navigation }) {

    const handleGoBack = () =>{
      navigation.navigate(UPLOAD_PROCEDURE);
    }

    return (
            <TouchableOpacity disabled style={{ flex: 1, backgroundColor: '#000000DD', position: 'absolute', left: 0, top: 0, height: '100%', width: '100%', opacity: 100 }}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                <Text testID={"txtTitle"} accessibilityLabel={"txtTitle"} style={{ color: 'white', margin: 24, textAlign: 'center', fontWeight: 'bold' }}>RECOMENDACIONES PARA CAPTURAR LA FOTO DEL FORMULARIO</Text>
                <Text testID={"txtStepOne"} accessibilityLabel={"txtStepOne"} style={{ color: 'white', margin: 10, width: '75%' }}>1) Apoyá el formulario en una mesa.</Text>
                <Text testID={"txtStepTwo"} accessibilityLabel={"txtStepTwo"} style={{ color: 'white', margin: 10, width: '75%' }}>2) Acomodá el formulario y la cámara de modo vertical.</Text>
                <Text testID={"txtStepThree"} accessibilityLabel={"txtStepThree"} style={{ color: 'white', margin: 10, width: '75%' }}>3) Sostené la cámara con las dos manos y obtené la foto.</Text>
                <Text testID={"txtStepSubInfo"} accessibilityLabel={"txtStepSubInfo"} style={{ color: 'white', margin: 10, width: '75%' }}>En algunos teléfonos más avanzados, la cámara detecta si la foto está fuera de foco.</Text>
                <Text testID={"txtStepFour"} accessibilityLabel={"txtStepFour"} style={{ color: 'white', margin: 10, width: '75%' }}>4) Una vez obtenida, enviá la gestión y esperá la respuesta del sistema.</Text>
              </View>
              <View>
                <Button testID={"btnReturn"} accessibilityLabel={"btnReturn"}  bordered full style={{ borderColor: 'white', margin: 16, borderRadius: 4 }} onPress={() => handleGoBack()}>
                  <Text testID={"lblBtnReturn"} accessibilityLabel={"lblBtnReturn"} style={{ color: 'white', fontWeight: 'bold' }}>VOLVER</Text>
                </Button>
              </View>
            </TouchableOpacity>
    )


}
