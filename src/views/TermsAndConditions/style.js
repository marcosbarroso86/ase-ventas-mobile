import { StyleSheet } from "react-native";

export default StyleSheet.create({
    bodyText: {
        color: 'white',
        fontSize: 12,
        marginLeft: 24,
        marginRight: 24,
        marginTop: 4,
        textAlign: 'left'
    },
    boldText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold'
    },
    acceptButton: {
        borderColor: 'white',
        borderRadius: 4,
        margin: 26
    },
    content: {
        flexGrow: 1
    },
    contentTitleModal: {
        fontSize: 20,
        marginBottom: 12
    },
    contentModal: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)'
    },
    mainContent: {
        backgroundColor: '#000000DD',
        height: '100%',
        left: 0,
        opacity: 100,
        position: 'absolute',
        top: 24,
        width: '100%'
    },
    mainView: {
        alignItems: 'stretch',
        flex: 1,
        justifyContent: 'center'
    },
    footerView: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        marginBottom: 12
    },
    subtitle: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 12,
        marginLeft: 24,
        marginRight: 24,
        textAlign: 'left'
    },
    title: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 6,
        marginTop: 14,
        marginLeft: 24,
        marginRight: 24,
        textAlign: 'center'
    }
});
