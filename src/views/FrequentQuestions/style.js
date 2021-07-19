import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
    },
    containerAccordion: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 15,
        backgroundColor: '#F2F2F7',
    },
    accordion: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        padding: 5,
    },
    accordionHeader: {
        flex: 1,
        width: Dimensions.get("window").width,
        alignItems: 'center',
        justifyContent: "space-around",
        flexDirection: 'row',
        marginVertical: 5,
        borderRadius: 5,
    },
    accordionItems: {
        marginTop: 10,
        borderRadius: 5,
    },
    accordionItemValue:{
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    accordionItemValueName: {
        color: 'black',
        textAlign: 'left',
        marginRight: 10,
        marginLeft: 20,
        borderRadius: 5,
    },
    buttonContainer: {
        height: 50,
        width: '20%',
        justifyContent: "center",
        alignItems: "center",
    },
    accordionQuestion: {
        height: '50%', 
        width: '80%',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 20,
    },
    header: {
        width: '100%',
        backgroundColor: '#F2F2F7',
        height: 40,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    contentIcon: {
        justifyContent:'center', 
        alignItems:'flex-start', 
        width: "30%", 
        height: 40
    },
    contentTitle: {
        flex: 1,
        height: 40,
        width: '40%',
        justifyContent: 'center', 
        alignItems: "flex-start",
    },
    title: {
        textAlign: 'center', 
        fontWeight: 'bold', 
        fontSize: 18, 
        height: 40, 
        marginTop: 10
    },
    goBackButton: {
        flex:1,
        justifyContent:"center",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: '#f16921', 
        borderRadius: 4
    },
    spinnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        zIndex: 1,
    }
})