import { StyleSheet } from "react-native";

export default StyleSheet.create({
    btnAccept: {
        width: 110, 
        margin: 10, 
        backgroundColor: "#f16921",
    },
    btnCancel: {
        width: 110, 
        margin: 10, 
        backgroundColor: "#f16921"
    },
    btnsContainer: {
        flex: 1,
        flexDirection: 'row',
        textAlign: 'center'
    },
    contentModal: {
        backgroundColor: 'white',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        // elevation: 5,
        height: 150,
    },
    contentTitleModal: {
        fontSize: 16,
        marginBottom: 10
    }
});