import { StyleSheet, Dimensions } from "react-native";

const windowHeight = Dimensions.get('screen').height;

export default StyleSheet.create({
    borderBottomColorRed: {
        borderBottomColor: 'red',
        borderBottomWidth: 2
    },
    borderBottomWidth0: {
        borderBottomWidth: 0
    },
    borderBottomWidth2: {
        borderBottomWidth: 2
    },
    btnDefault: {
        borderRadius: 4,
        elevation: 2,
        marginBottom: 0,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },
    btnSendEmail: {
        backgroundColor: 'gray'
    },
    btnStartProcedure: {
        backgroundColor: '#f16820'
    },
    btnPictureTutorial: {
        borderColor: '#f16820',
        backgroundColor: 'white',
    },
    btnTakePicture: {
        backgroundColor: '#fff',
        borderRadius: 2,
        elevation: 3,
        marginBottom: 0,
        marginTop: 10,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 }
    },
    btnCamera: {
        marginLeft: 10,
        marginRight: 5
    },
    btnUpload: {
        marginLeft: 5,
        marginRight: 10
    },
    cardPicture: {
        alignItems: 'center',
        alignContent: 'center',
        borderColor: 'black',
        flex: 1,
        height: 200,
        justifyContent: 'center'
    },
    cardPictureError: {
        alignItems: 'center',
        alignContent: 'center',
        borderColor: 'red',
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderTopWidth: 3,
        flex: 1,
        height: 200,
        justifyContent: 'center'
    },
    disabledInput: {
        backgroundColor: '#E9E9E9',
        borderRadius: 4,
    },
    deleteImage: {
        position: 'absolute',
        paddingTop: 3,
        paddingLeft: .7
    },
    flex: {
        flex: 1
    },
    fontSize14: {
        fontSize: 12
    },  
    fontSize15: {
        fontSize: 15,
    },
    iconError: {
        color: 'red',
        fontSize: 20
    },
    iconInfo: {
        color: 'black',
        fontSize: 20
    },
    iconTakePicture: {
        paddingLeft: 5,
        textAlign: 'right',
        width: '20%'
    },
    imgPhoto: {
        flex: 1,
        height: 175,
        width: null
    },
    imageTextError: {
        marginBottom: 10
    },
    item: {
        borderBottomWidth: 2,
        marginLeft: 10,
        marginRight: 10
    },
    itemBussinesName: {
        borderBottomWidth: 0,
        marginLeft: 10,
        marginRight: 10
    },
    itemCUILError: {
        borderBottomWidth: 0,
        marginBottom: 10
    },
    margin10: {
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },
    margin24: {
        margin: 22
    },
    marginHoriz10: {
        marginLeft: 10,
        marginRight: 10
    },
    marginVert10: {
        marginTop: 10
    },
    marginVert16: {
        marginBottom: 16,
        marginTop: 16
    },
    textBusinessName: {
        marginLeft: 4
    },
    textBtn: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    textError: {
        color: 'red',
        fontSize: 14
    },
    textInfo: {
        color: 'black',
        marginTop: 10,
        marginBottom: -10,
        fontSize: 14
    },
    textCUIL: {
        fontSize: 17,
        justifyContent: 'flex-start',
        width: '101%',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 5
    },
    textCUIT: {
        fontSize: 15,
        justifyContent: 'flex-start',
        width: '101%',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 5,
    },
    textTakePicture: {
        color: 'black',
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'left',
        width: '80%'
    },
    textTitle: {
        marginBottom: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    viewSexChoice: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 5
    },
    viewSexRadioButton: {
        alignContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 16
    },
    viewTakePicture: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    width50: {
        width: '50%'
    },
    zIndex1: {
        zIndex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "#e5e5e5"
    },
    touchableOpacityStyle: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        top: windowHeight / 1.45,
        zIndex: 3,
        shadowColor: "black",
        shadowOffset: {
            width: 2,
            height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 4
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
    disabled: {
        opacity: 0.4
    },
    close: {
        margin: 5,
        position: "absolute",
        top: 0,
        right: 0,
        width: 28,
        height: 28,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20
    },
    viewContainer: {
        width: '100%',
        height: 175
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    }

})