import React from "react";
import { Image, Text } from "react-native";
import {
  Header,
  Button,
  Left,
  Body,
  Right,
  View,
} from "native-base";

import { Ionicons, Foundation } from "@expo/vector-icons";

import styles from "./style";

export default function HeaderNew({
  onPress,
  navigation,
  rightVisible = true,
  title
}) {
  return (
    <View>
      <Header style={styles.header} androidStatusBarColor={"#e45205"}>
        <Left style={{ flex: 0.2 }}>
          <Button
            testID={"btnOpenMenu"}
            accessibilityLabel={"btnOpenMenu"}
            transparent
            onPress={() => onPress()}
          >
            <Ionicons style={styles.icon} name="md-menu" size={24} />
          </Button>
        </Left>
        <Body style={{ flex: 0.6, alignItems:"center" }}>
          { title? <Text style={styles.headerTitle}>{title}</Text> : <Image
            testID={"imgLogo"}
            accessibilityLabel={"imgLogo"}
            source={require("../../../assets/ase_nacional_imagen_app.png")}
            style={styles.image}
          />}
        </Body>
        <Right style={{ flex: 0.2 }}>
          {rightVisible && (
            <Button
              testID={"btnOpenInfo"}
              accessibilityLabel={"btnOpenInfo"}
              transparent
              onPress={() => navigation.navigate("InfoProcedure")}
            >
              <Foundation style={styles.icon} name="info" size={24} />
            </Button>
          )}
        </Right>
      </Header>
    </View>
  );
}
