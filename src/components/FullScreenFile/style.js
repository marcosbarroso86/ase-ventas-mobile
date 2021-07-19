import { Dimensions, StyleSheet } from "react-native";
import Constants from 'expo-constants';

export default StyleSheet.create({
    fileContent: {
        backgroundColor: 'black',
        resizeMode: 'center',
        height: Dimensions.get("window").height / 5,
        width: Dimensions.get("window").width
    },
    btnFullScreenContainer: {
        alignItems: 'flex-end',
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10
    },
    btnFullScreenContent: {
        backgroundColor: 'gray',
        borderRadius: 100,
        marginTop: 10
    },
    iosSpacer: {
        height: Constants.statusBarHeight,
        backgroundColor: '#f16820'
    },
    spinnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 4,
        backgroundColor: 'rgba(52, 52, 52, 0.55)'
    }
});
