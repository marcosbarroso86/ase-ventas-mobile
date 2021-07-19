import React from "react";
import { Text, Image, View } from "react-native";
import { Container, Content, Grid, Item, Form, Button } from "native-base";

import genericStyles from "../../styles";
import styles from "./style";

import { UPLOAD_PROSPECT, PROSPECTS_STACK } from "../../consts";

export default function ProspectNotification({ route, navigation }) {
  const handleProspects = () => {
    navigation.navigate(UPLOAD_PROSPECT);
    navigation.navigate(PROSPECTS_STACK);
  };

  const handleNewProcedure = () => {
    navigation.navigate(UPLOAD_PROSPECT);
  };

  return (
    <Container>
      <Content contentContainerStyle={styles.content}>
        <Grid style={genericStyles.centeredGrid}>
          <Form style={genericStyles.form}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <View style={{ height: "90%", justifyContent: "space-between" }}>
                <Image
                  testID={"imgLogo"}
                  accessibilityLabel={"imgLogo"}
                  source={require("../../../assets/ase_nacional_imagen_app.png")}
                  style={{
                    marginTop: 50,
                    width: 180,
                    height: 60,
                    alignSelf: "center",
                    tintColor: "white",
                  }}
                />
                <Text
                  testID={"titleProcedureNotification"}
                  accessibilityLabel={"titleProcedureNotification"}
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  ¡PROSPECT #{route.params.procedure.id} INICIADO!
                </Text>
                <Item style={{ marginLeft: 0 }}>
                  {route.params.businessName ? (
                    <Text style={{ color: "white", textAlign: "left" }}>
                      {route.params.businessName.trim()}, CUIT{" "}
                      {route.params.cuit}
                    </Text>
                  ) : (
                    <Text style={{ color: "white", textAlign: "left" }}>
                      CUIT {route.params.cuit}
                    </Text>
                  )}
                </Item>
                <Item style={{ marginLeft: 0 }}>
                  <Text style={styles.subtitle}>{route.params.cuil}</Text>
                </Item>
                <Text
                  testID={"txtParagraphOne"}
                  accessibilityLabel={"txtParagraphOne"}
                  style={{ color: "white", textAlign: "center" }}
                >
                  El prospect será procesado por los Analistas de BackOffice.
                </Text>
                <Text
                  testID={"txtParagraphTwo"}
                  accessibilityLabel={"txtParagraphTwo"}
                  style={{ color: "white", textAlign: "center" }}
                >
                  Recibirás notificaciones de las modificaciones o cambios en el
                  prospect.
                </Text>
                <Text
                  testID={"txtParagraphThree"}
                  accessibilityLabel={"txtParagraphThree"}
                  style={{ color: "white", textAlign: "center" }}
                >
                  Ingresá a las notificaciones periódicamente para conocer los
                  estados.
                </Text>
                <Text
                  testID={"txtParagraphFour"}
                  accessibilityLabel={"txtParagraphFour"}
                  style={{ color: "white", textAlign: "center" }}
                >
                  También podés acceder a "Mis prospects" desde el menú de la
                  aplicación.
                </Text>
              </View>
            </View>
            <Button
              warning
              style={{
                margin: 24,
                backgroundColor: "#f16921",
                borderRadius: 4,
                marginBottom:24,
              }}
              onPress={handleNewProcedure}
            >
              <Text
                testID={"btnGoToNewProspect"}
                accessibilityLabel={"btnGoToNewProspect"}
                style={{
                  flex: 1,
                  textAlign: "center",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                NUEVA CONSULTA DE PROSPECT
              </Text>
            </Button>
            <Button
              bordered
              full
              style={{ borderColor: "white", margin: 24, borderRadius: 4 }}
              onPress={handleProspects}
            >
              <Text
                testID={"btnGoToMyProspect"}
                accessibilityLabel={"btnGoToMyProspect"}
                style={{
                  color: "white",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                IR A MIS PROSPECTS
              </Text>
            </Button>
        </Form>
        </Grid>
      </Content>
    </Container>
  );
}
