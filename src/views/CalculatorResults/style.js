import {StyleSheet} from 'react-native';

export default StyleSheet.create({
    content: {
        flex: 1,
    },
    centeredGrid: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textTitle: {
        marginBottom: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    form: {
        height: '100%',
        width: '100%',
        padding: 30,
        justifyContent: 'space-between'
    },
    salaryInput: {
        width: '100%',
        paddingRight: 25
    },
    resultsText: {
        flexDirection: 'row',
        borderBottomColor: 'white',
        justifyContent: 'space-between'
    },
    button: {
        marginTop: 15,
        width: '100%',
        height: 45,
        justifyContent: "center",
        backgroundColor: '#e75300'
    },
    salaryInputContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    resultsContainer: {
        flexGrow: 2,
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    resultsTitle: {
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 30
    },
    resultsTextContainer: {
        flexGrow: 1,
        justifyContent: 'space-around',
        maxHeight: 150
    },
    input: {
        fontSize: 18,
        justifyContent: 'flex-start',
        width: '100%',
        paddingTop: 12,
        paddingBottom: 7,
        paddingLeft: 5,
    }
});