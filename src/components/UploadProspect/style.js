import { StyleSheet } from "react-native";

export default StyleSheet.create({
    borderBottomColorRed: {
        borderBottomColor: 'red'
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
        borderColor: '#f16820' ,
        backgroundColor: 'white',
    },
    btnTakePicture: {
        backgroundColor: '#fff',
        borderRadius: 2,
        elevation: 3,
        marginBottom: 0,
        marginTop: 10
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
    flex: {
        flex: 1
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    fontSize15: {
        fontSize: 15
    },
    iconError: {
        color:'red',
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
    item: {
        borderBottomWidth: 2,
        marginLeft: 10,
        marginRight: 10
    },
    itemCUILError: {
        borderBottomWidth: 0,
        marginBottom: 10
    },
    itemBussinesName: {
        borderBottomWidth: 0,
        marginLeft: 10,
        marginRight: 10
    },
    margin10: {
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },
    margin24: {
        margin: 24
    },
    marginHoriz10: {
        marginLeft: 10,
        marginRight: 10
    },
    marginVert10: {
        marginBottom: 10,
        marginTop: 10
    },
    marginVert16: {
        marginBottom: 16,
        marginTop: 16
    },
    textBtn: {
        flex: 1, 
        fontWeight: 'bold',
        textAlign: 'center' 
    },
    textError: {
        color:'red',
        fontSize: 14
    },
    textCUIL: {
        fontSize: 17,
        justifyContent: 'flex-start',
        margin: 5,
        width:'100%'
    },
    textCUIT: {
        fontSize: 15,
        justifyContent: 'flex-start',
        margin: 5,
        width: '100%'
    },
    textTakePicture: {
        color: 'black',
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'left',
        width: '80%'
    },
    textBusinessName: {
        marginLeft: 4
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
    spinnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: 1,
        backgroundColor: 'rgba(52, 52, 52, 0.55)'
    },
    disabled: {
        opacity: 0.4
    }
})