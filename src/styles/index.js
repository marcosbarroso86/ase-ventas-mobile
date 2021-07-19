import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  centeredContent: {
    flex: 1
  },
  centeredGrid: {
    alignItems: "center",
    justifyContent: "center"
  },
  textWhite: {
    color: '#FFF'
  },
  textBlack: {
    color: '#000'
  },
  btnDefault : {
    marginTop: 15,
    width: width / 1.5,
    height: 45,
    justifyContent: "center",
  },
  form: {
    width: 300,
  },
  btnShadow: {
    shadowColor: "black",
    shadowOpacity: .2,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 3 }
  }
});
