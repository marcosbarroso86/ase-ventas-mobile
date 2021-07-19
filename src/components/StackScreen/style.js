import { Dimensions, StyleSheet } from "react-native";

export default StyleSheet.create({
  header: {
    backgroundColor: "#f16921",
    height: Dimensions.get("window").height/5,
    justifyContent:'center', 
    alignItems: 'center' 
  },
  image: {
    width: 150,
    height: 60,
    resizeMode: "stretch",
    tintColor: "white",
  },
  content: {
    backgroundColor: 'white',
    height: '100%'
  },
  footer: {
    height: 30,
    backgroundColor: '#f16820', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white'
  }
});
