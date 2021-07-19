import {StyleSheet} from 'react-native';


export default StyleSheet.create({
    content:{
        flex: 1,
        backgroundColor: '#a9a9a9'},

    wrapperImg: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#a9a9a9'
    },
    img : {
        width: 180,
        height: 60
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    grid: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentModal: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitleModal: {
        fontSize: 20,
        marginBottom: 12,
    },
    cuitInput: {
        fontSize: 16,
        height: 40,
        justifyContent: "flex-start",
        marginTop: 2,
        color: "white",
        width: "100%",
    },
    borderBottomColorRed: {
        borderBottomColor: 'red',
        borderBottomWidth: 2
    },
    marginHoriz10: {
        marginLeft: 10,
        marginRight: 10
    },
    textError: {
        color: 'red',
        fontSize: 14
    },
    iconError: {
        color: 'red',
        fontSize: 20
    },
    borderBottom: {
        borderBottomColor: null,
        borderBottomWidth: 2,
        flexDirection: "column",
        alignItems: "stretch",
        marginTop: 10,
    },
    textBusinessName: {
        width: '100%',
        fontSize: 16,
        color: "white",
        textAlignVertical: 'center',
    },
    itemBusinessName: {
        flex: 1,
        marginTop: 20,
        marginBottom: -10,
        borderBottomColor: '#a9a9a9'
    },
    itemInputCuit: {
        borderBottomColor: null,
        borderBottomWidth: 2,
        flexDirection: "row",
        justifyContent: 'flex-start',
        marginTop: 10
    },
    inputCompany: {
        width: "90%",
        height: 40,
        justifyContent: "space-between",
        marginTop: 2,
        fontSize: 16,
        color: "white",
    },
    itemCross: {
        height: 40,
        width: '10%',
        borderBottomWidth: 2,
        marginTop: 14
    }
});
