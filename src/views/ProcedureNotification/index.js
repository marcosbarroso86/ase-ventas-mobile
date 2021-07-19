import React from 'react';
import { Text,Image,View} from 'react-native';
import { Container, Content, Grid, Item, Form, Button } from 'native-base';

import genericStyles from '../../styles';
import styles from './style';

import { UPLOAD_PROCEDURE, PROCEDURES_STACK } from '../../consts';

export default function ProcedureNotification({route,navigation}){


    const handleProcedures = () => {
        navigation.navigate(UPLOAD_PROCEDURE);
        navigation.navigate(PROCEDURES_STACK);
    }

    const handleNewProcedure = () => {
        navigation.navigate(UPLOAD_PROCEDURE);
    }

    return (
        <Container>
            <Content contentContainerStyle={styles.content}>
                    <Grid style={genericStyles.centeredGrid}>
                        <Form style={genericStyles.form}>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <View style={{  height: '90%', justifyContent: 'space-between' }}>
                                    <Image testID={"imgLogoProcedureCreated"} accessibilityLabel={"imgLogoProcedureCreated"} source={require('../../../assets/ase_nacional_imagen_app.png')} style={{ marginTop: 50, width: 180, height: 60, alignSelf: 'center', tintColor: 'white' }} />
                                    <Text testID={"titleProcedureNotification"} accessibilityLabel={"titleProcedureNotification"} style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}>¡GESTIÓN #{route.params.procedure.id} INICIADA!</Text>
                                    <Item style={{marginLeft:0}} >
                                        {   (route.params.businessName)?
                                                (   <Text testID={"lblCompany"} accessibilityLabel={"lblCompany"} style={{color: 'white', textAlign:'left'}}>{route.params.businessName.trim()}, CUIT {route.params.cuit}</Text>
                                                ):(
                                                    <Text testID={"lblCompany"} accessibilityLabel={"lblCompany"} style={{color: 'white', textAlign:'left'}}>CUIT {route.params.cuit}</Text>
                                                )
                                        }
                                    </Item>
                                    <Item style={{marginLeft:0}} >
                                        <Text testID={"lblCuil"} accessibilityLabel={"lblCuil"} style={styles.subtitle}>{route.params.cuil}</Text>
                                    </Item>
                                    <Text testID={"txtParagraphOne"} accessibilityLabel={"txtParagraphOne"}
                                          style={{ color: 'white', textAlign:'center' }}>
                                        La gestión será procesada por los Analistas de BackOffice.
                                    </Text>
                                    <Text testID={"txtParagraphTwo"} accessibilityLabel={"txtParagraphTwo"}
                                          style={{ color: 'white', textAlign:'center' }}>
                                        Recibirás notificaciones de las modificaciones o cambios en las gestiones.
                                    </Text>
                                    <Text testID={"txtParagraphThree"} accessibilityLabel={"txtParagraphThree"}
                                          style={{ color: 'white', textAlign:'center' }}>
                                        Ingresá a las notificaciones periódicamente para conocer los estados.
                                    </Text>
                                    <Text testID={"txtParagraphFour"} accessibilityLabel={"txtParagraphFour"}
                                          style={{ color: 'white', textAlign:'center' }}>
                                        También podés acceder a "Mis gestiones" desde el menú de la aplicación.
                                    </Text>
                                </View>
                            </View>
                        <Button testID={"btnGoToNewProcedure"} accessibilityLabel={"btnGoToNewProcedure"} warning style={[genericStyles.btnShadow, { margin: 24, backgroundColor: '#f16921', marginBottom: 0, borderRadius: 4 }]} onPress={handleNewProcedure} >
                                <Text testID={"lblBtnGoToNewProcedure"} accessibilityLabel={"lblBtnGoToNewProcedure"} style={{ flex: 1, textAlign: 'center', color:'white', fontWeight: 'bold' }}>INICIAR NUEVA GESTIÓN</Text>
                            </Button>

                           <Button bordered full style={{  borderColor: 'white', margin: 24, borderRadius: 4 }} onPress={handleProcedures}>
                                <Text testID={"lblBtnGoToMyProcedure"} accessibilityLabel={"lblBtnGoToMyProcedure"} style={{ color: 'white', textTransform: 'uppercase', fontWeight: 'bold' }}>IR A MIS GESTIONES</Text>
                            </Button>
                        </Form>
                    </Grid>
            </Content>
        </Container>
    )
}
