import React from "react";
import { Text, Button, Container, View } from "native-base";
import genericStyles from '../../styles';
import styles from "./style";
import { useDispatch } from "react-redux";
import { logOut } from "../../redux/ducks/authenticateDucks";
import { HOME } from "../../consts";

export default function Confirmation({ navigation }) {
  const dispatch = useDispatch();

  const handleYes = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: HOME }]
    });
    dispatch(logOut());
  };

  const handleNo = async () => {
    navigation.navigate(HOME);
  };

  return (
    <Container style={styles.container}>
      <View style={styles.contentModal}>
        <View>
          <Text
            testID={"txtConfirmation"}
            accessibilityLabel={"txtConfirmation"}
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            ¿ Está seguro de cerrar la sesión ?
          </Text>
        </View>
        <View style={{ flexDirection: "row", marginTop: 50 }}>
          <Button
            warning
            style={[genericStyles.btnShadow, { width: 100, margin: 10, backgroundColor: "#f16921" }]}
            onPress={() => handleYes()}
          >
            <Text
              testID={"btnYes"}
              accessibilityLabel={"btnYes"}
              style={{ flex: 1, textAlign: "center" }}
            >
              Sí
            </Text>
          </Button>
          <Button
            warning
            style={[genericStyles.btnShadow, { width: 100, margin: 10, backgroundColor: "#f16921" }]}
            onPress={() => handleNo()}
          >
            <Text
              testID={"btnNo"}
              accessibilityLabel={"btnNo"}
              style={{ flex: 1, textAlign: "center" }}
            >
              No
            </Text>
          </Button>
        </View>
      </View>
    </Container>
  );
}
