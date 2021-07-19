import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Grid, Spinner } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

import styles from './style';

import { PROCEDURE } from '../../consts';

export default function FullScreenImage({navigation, route}) {
    const {id, image} = route.params;
    const [url, setUrl] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchImage() {
            setUrl(image);
        }
        fetchImage();
    }, []);

    const handleExitFullScreen = () => {
        navigation.navigate(PROCEDURE, {id});
    };

    const getUrl = () => {
        return {uri: url};
    }

    return (
        <Grid style={styles.container}>
            {loading &&
                <View style={styles.spinnerContainer}>
                    <Spinner
                        testID="spinner"
                        accessibilityLabel="spinner"
                        color="#f16921"
                        size="large"
                    />
                </View>}
            <View style={styles.viewContainer}>
                <View style={styles.btnFullScreenContainer}>
                    <TouchableOpacity onPress={() => handleExitFullScreen()}
                        style={styles.btnFullScreenContent}
                    >
                        <MaterialIcons name='fullscreen-exit' size={32} color='white'
                            testID={"btnFullscreenExit"} accessibilityLabel={"btnFullscreenExit"} />
                    </TouchableOpacity>
                </View>
                <Image testID={"imgFullscreen"} accessibilityLabel={"imgFullscreen"}
                    source={getUrl()} style={styles.imgContent} onLoadEnd={() => setLoading(false)}
                    defaultSource={require('../../../assets/image_not_available.jpg')} />
            </View>

        </Grid>
    );
}
