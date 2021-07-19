import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { View, TouchableOpacity, Platform } from "react-native";
import PDFReader from 'rn-pdf-reader-js';

import styles from './style';

import { PROCEDURE } from '../../consts';
import { Spinner, Container } from "native-base";

export default function FullScreenFile({navigation, route}) {
    
    const { id, file } = route.params;
    const [loading, setLoading] = React.useState(true);

    const handleExitFullScreen = () => {
        navigation.navigate(PROCEDURE, {id});
    };

    return (
        <Container>
            {loading &&
                <View style={styles.spinnerContainer}>
                    <Spinner
                        testID="spinner"
                        accessibilityLabel="spinner"
                        color="#f16921"
                        size="large"
                    />
                </View>}
            <View style={[{ flex: 1 }, Platform.OS === 'android' && { backgroundColor: '#555759' }]}>
                <View style={Platform.OS === 'ios' && styles.iosSpacer}></View>
                <View style={styles.btnFullScreenContainer}>
                    <TouchableOpacity onPress={() => handleExitFullScreen()}
                        style={styles.btnFullScreenContent}
                    >
                        <MaterialIcons name='fullscreen-exit' size={30} color='white'
                            testID={"btnFullscreenExit"} accessibilityLabel={"btnFullscreenExit"} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <PDFReader
                        source={{ uri: file }}
                        styles={styles.fileContent}
                        noLoader
                        onLoadEnd={() => setLoading(false)}
                        onError={() => { console.log('Error') }}
                        accessibilityLabel={"fileFullscreen"}
                    />
                </View>
            </View>
        </Container>
    );
}
