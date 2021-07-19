import { Dimensions, StyleSheet } from "react-native";
import Constants from 'expo-constants';

export default StyleSheet.create({
    btnFullScreenContent: {
        backgroundColor: '#ffffff40',
        borderRadius: 100,
    },
    btnFullScreenContainer: {
        alignItems: 'flex-end',
        marginTop: 10,
        marginRight: 10
    },
    imgContent: {
        alignContent: 'flex-start',
        backgroundColor: 'black',
        resizeMode: 'contain',
        height: Dimensions.get("screen").height / 1.1,
        width: Dimensions.get("window").width
    },
    spinnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 4,
        backgroundColor: 'rgba(52, 52, 52, 0.55)'
    },
    viewContainer: {
        backgroundColor: 'black',
        marginTop: Constants.platform.ios ? Constants.statusBarHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#f16820'
    }
});
