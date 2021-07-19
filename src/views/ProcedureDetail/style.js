import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    btnFullScreenContent: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#e5e5e58c',
        justifyContent: 'center'
    },
    btnNotifContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    btnNotifContent : {
        backgroundColor: '#f16921',
        borderRadius: 10,
        elevation: 3,
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: 250
    },
    btnNotifText: {
        alignSelf: 'center',
        color: '#fff',
        flexDirection: 'row',
        fontSize: 12,
        fontWeight: 'bold',
        justifyContent: 'center',
        textTransform: 'uppercase'
    },
    cardItemContainer: {
        paddingBottom: 10,
        paddingLeft: 10,
        width: '100%'
    },
    cardBody: {
        backgroundColor: '#f4f4f4',
        flexDirection: 'column',
    },
    cardContainer: {
        borderRadius: 3,
        padding: 10,
        paddingRight: 10,
        paddingTop: 10,
        width: '100%'
    },
    cardDate: {
        color: '#b1bbb1',
        fontSize: 12,
        marginTop: 5,
    },
    cardText: {
        color: '#5a6773',
        fontSize: 15,
        fontWeight: 'bold',
        paddingTop: 3
    },
    cardTitleText: {
        fontSize: 20
    },
    content: {
        backgroundColor: '#ffffff',
        flexGrow: 1
    },
    cuilText: {
        fontSize: 13
    },
    cuitText: {
        fontSize: 13
    },
    header: {
        backgroundColor: '#f16820',
        height: 60
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 18
    },
    icon: {
        color: 'white'
    },
    fileContainer: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingRight: 10,
        paddingTop: 10,
        width: '100%'
    },
    fileContent: {
        flex: 1,
        height: 210,
        resizeMode: 'cover'
    },
    obsText: {
        fontSize: 12
    },
    stateText: {
        fontSize: 14,
        fontWeight: 'bold'
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
