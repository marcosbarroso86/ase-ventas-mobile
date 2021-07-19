import { StyleSheet } from 'react-native';

import {  WHITE } from "../../consts";

export default StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#7a7e7f'
    },
    subtitle: {
        color: 'white',
        textAlign:'center'
    },
    textColor:{
        color:'white' 
    },
    item:{
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'transparent',
        marginTop: 20,
        marginBottom: 20
    },
    forwardButton: {
        position: "absolute",
        top: 8,
        left: 4
    },
    backIcon: {
        color: WHITE
    }
});
