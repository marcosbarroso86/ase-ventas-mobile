import React, { useCallback, useState } from "react";
import { Text, Button, Spinner } from "native-base";
import { View, TouchableOpacity} from "react-native";
import {  Content, Grid} from "native-base";
import { useDispatch, useSelector} from "react-redux";
import { useFocusEffect } from '@react-navigation/native';

import styles from './style';

import InfoModal from "../../components/Modals/InfoModal";

import {
    TERMS_AND_CONDITIONS_MAIN_TITLE, TERMS_AND_CONDITIONS_INTRO_1_1, 
    TERMS_AND_CONDITIONS_INTRO_1_2, TERMS_AND_CONDITIONS_INTRO_1_3, TERMS_AND_CONDITIONS_INTRO_1_4, 
    TERMS_AND_CONDITIONS_INTRO_1_5, TERMS_AND_CONDITIONS_INTRO_1_6, TERMS_AND_CONDITIONS_INTRO_1_7, 
    TERMS_AND_CONDITIONS_INTRO_2, TERMS_AND_CONDITIONS_SUBTITLE_1, TERMS_AND_CONDITIONS_SUBTITLE_2,
    TERMS_AND_CONDITIONS_SUBTITLE_3, TERMS_AND_CONDITIONS_SUBTITLE_4, TERMS_AND_CONDITIONS_SUBTITLE_5,
    TERMS_AND_CONDITIONS_SUBTITLE_6, TERMS_AND_CONDITIONS_SUBTITLE_7, TERMS_AND_CONDITIONS_SUBTITLE_8,
    TERMS_AND_CONDITIONS_SUBTITLE_9, TERMS_AND_CONDITIONS_SUBTITLE_10, TERMS_AND_CONDITIONS_SUBTITLE_11,
    TERMS_AND_CONDITIONS_SUBTITLE_12, TERMS_AND_CONDITIONS_PART_1_1, TERMS_AND_CONDITIONS_PART_1_2,
    TERMS_AND_CONDITIONS_PART_1_3, TERMS_AND_CONDITIONS_PART_1_4, TERMS_AND_CONDITIONS_PART_1_5,
    TERMS_AND_CONDITIONS_PART_2_1, TERMS_AND_CONDITIONS_PART_2_2, TERMS_AND_CONDITIONS_PART_2_3,
    TERMS_AND_CONDITIONS_PART_2_4, TERMS_AND_CONDITIONS_PART_2_5, TERMS_AND_CONDITIONS_PART_2_6,
    TERMS_AND_CONDITIONS_PART_2_7, TERMS_AND_CONDITIONS_PART_2_8, TERMS_AND_CONDITIONS_PART_3_1, 
    TERMS_AND_CONDITIONS_PART_3_2, TERMS_AND_CONDITIONS_PART_4_1, TERMS_AND_CONDITIONS_PART_4_2, 
    TERMS_AND_CONDITIONS_PART_4_3, TERMS_AND_CONDITIONS_PART_5_1_1, TERMS_AND_CONDITIONS_PART_5_1_2,
    TERMS_AND_CONDITIONS_PART_5_1_3, TERMS_AND_CONDITIONS_PART_5_2, TERMS_AND_CONDITIONS_PART_5_3,
    TERMS_AND_CONDITIONS_PART_5_4, TERMS_AND_CONDITIONS_PART_6_1, TERMS_AND_CONDITIONS_PART_6_2,
    TERMS_AND_CONDITIONS_PART_7_1, TERMS_AND_CONDITIONS_PART_8_1, TERMS_AND_CONDITIONS_PART_9_1,
    TERMS_AND_CONDITIONS_PART_9_2, TERMS_AND_CONDITIONS_PART_9_3, TERMS_AND_CONDITIONS_PART_9_4, 
    TERMS_AND_CONDITIONS_PART_10_1, TERMS_AND_CONDITIONS_PART_10_2, TERMS_AND_CONDITIONS_PART_11_1,
    TERMS_AND_CONDITIONS_PART_12_1, TERMS_AND_CONDITIONS_PART_12_2, 
    TERMS_AND_CONDITIONS_PART_12_3 } from "../../consts";

import { updateExecutive } from "../../redux/api/executive";
import { setIsLoged } from '../../redux/ducks/authenticateDucks';

export default function TermsAndConditions({navigation }) {

    const dispatch = useDispatch();

    const executive = useSelector(store => store.authentication.data);

    const [isErrModal, setIsErrModal] = useState(false);
    const [serviceError, setServiceError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAcept = () => {
        updateUser();
    }

    const toggleErrModal = () => {
        setIsErrModal(false);
    }

    const updateUser = async() => {
        let payload = {id: executive.id, areAcceptedTerms: true};
        setLoading(true);
        try {
            await updateExecutive(payload);
            executive.areAcceptedTerms = true;
            dispatch(setIsLoged(JSON.stringify(executive)));
        } catch (error) {
            setServiceError(errorUpdate);
            setIsErrModal(true);
 
        }finally{
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            setServiceError("");
        }, [])
    );

    return (
        <TouchableOpacity disabled style={styles.mainContent}>
            <Content contentContainerStyle={[styles.content]}>
                <Grid>
                    <View style={styles.mainView}>
                        <Text testID={"txtTitle"} accessibilityLabel={"txtTitle"} style={styles.title}>
                            {TERMS_AND_CONDITIONS_MAIN_TITLE}
                        </Text>

                        <Text testID={"intro1"} accessibilityLabel={"intro1"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_INTRO_1_1}
                            <Text testID={"intro1_1"} accessibilityLabel={"intro1_2"} style={styles.boldText}>
                                {TERMS_AND_CONDITIONS_INTRO_1_2}
                            </Text>
                            {TERMS_AND_CONDITIONS_INTRO_1_3}
                            <Text testID={"intro1_4"} accessibilityLabel={"intro1_4"} style={styles.boldText}>
                                {TERMS_AND_CONDITIONS_INTRO_1_4}
                            </Text>
                            {TERMS_AND_CONDITIONS_INTRO_1_5}
                            <Text testID={"intro1_6"} accessibilityLabel={"intro1_6"} style={styles.boldText}>
                                {TERMS_AND_CONDITIONS_INTRO_1_6}
                            </Text>
                            {TERMS_AND_CONDITIONS_INTRO_1_7}
                        </Text>
                        <Text testID={"intro2"} accessibilityLabel={"intro2"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_INTRO_2}
                        </Text>

                        <Text testID={"subtitle1"} accessibilityLabel={"subtitle1"} style={styles.subtitle}>
                            {TERMS_AND_CONDITIONS_SUBTITLE_1}
                        </Text>
                        <Text testID={"part1_1"} accessibilityLabel={"part1_1"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_1_1}
                        </Text>
                        <Text testID={"part1_2"} accessibilityLabel={"part1_2"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_1_2}
                        </Text>
                        <Text testID={"part1_3"} accessibilityLabel={"part1_3"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_1_3}
                        </Text>
                        <Text testID={"part1_4"} accessibilityLabel={"part1_4"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_1_4}
                        </Text>
                        <Text testID={"part1_5"} accessibilityLabel={"part1_5"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_1_5}
                        </Text>

                        <Text testID={"subtitle2"} accessibilityLabel={"subtitle2"} style={styles.subtitle}>
                            {TERMS_AND_CONDITIONS_SUBTITLE_2}
                        </Text>
                        <Text testID={"part2_1"} accessibilityLabel={"part2_1"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_2_1}
                        </Text>
                        <Text testID={"part2_2"} accessibilityLabel={"part2_2"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_2_2}
                        </Text>
                        <Text testID={"part2_3"} accessibilityLabel={"part2_3"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_2_3}
                        </Text>
                        <Text testID={"part2_4"} accessibilityLabel={"part2_4"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_2_4}
                        </Text>
                        <Text testID={"part2_5"} accessibilityLabel={"part2_5"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_2_5}
                        </Text>
                        <Text testID={"part2_6"} accessibilityLabel={"part2_6"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_2_6}
                        </Text>
                        <Text testID={"part2_7"} accessibilityLabel={"part2_7"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_2_7}
                        </Text>
                        <Text testID={"part2_8"} accessibilityLabel={"part2_8"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_2_8}
                        </Text>

                        <Text testID={"subtitle3"} accessibilityLabel={"subtitle3"} style={styles.subtitle}>
                            {TERMS_AND_CONDITIONS_SUBTITLE_3}
                        </Text>
                        <Text testID={"part3_1"} accessibilityLabel={"part3_1"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_3_1}
                        </Text>
                        <Text testID={"part3_2"} accessibilityLabel={"part3_2"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_3_2}
                        </Text>

                        <Text testID={"subtitle4"} accessibilityLabel={"subtitle4"} style={styles.subtitle}>
                            {TERMS_AND_CONDITIONS_SUBTITLE_4}
                        </Text>
                        <Text testID={"part4_1"} accessibilityLabel={"part4_1"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_4_1}
                        </Text>
                        <Text testID={"part4_2"} accessibilityLabel={"part4_2"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_4_2}
                        </Text>
                        <Text testID={"part4_3"} accessibilityLabel={"part4_3"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_4_3}
                        </Text>

                        <Text testID={"subtitle5"} accessibilityLabel={"subtitle5"} style={styles.subtitle}>
                            {TERMS_AND_CONDITIONS_SUBTITLE_5}
                        </Text>
                        <Text testID={"part5_1"} accessibilityLabel={"part5_1"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_5_1_1}
                            <Text testID={"part5_1_2"} accessibilityLabel={"part5_1_2"} style={styles.boldText}>
                                {TERMS_AND_CONDITIONS_PART_5_1_2}
                            </Text>
                            {TERMS_AND_CONDITIONS_PART_5_1_3}
                        </Text>
                        <Text testID={"part5_2"} accessibilityLabel={"part5_2"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_5_2}
                        </Text>
                        <Text testID={"part5_3"} accessibilityLabel={"part5_3"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_5_3}
                        </Text>
                        <Text testID={"part5_4"} accessibilityLabel={"part5_4"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_5_4}
                        </Text>

                        <Text testID={"subtitle6"} accessibilityLabel={"subtitle6"} style={styles.subtitle}>
                            {TERMS_AND_CONDITIONS_SUBTITLE_6}
                        </Text>
                        <Text testID={"part6_1"} accessibilityLabel={"part6_1"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_6_1}
                        </Text>
                        <Text testID={"part6_2"} accessibilityLabel={"part6_2"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_6_2}
                        </Text>

                        <Text testID={"subtitle7"} accessibilityLabel={"subtitle7"} style={styles.subtitle}>
                            {TERMS_AND_CONDITIONS_SUBTITLE_7}
                        </Text>
                        <Text testID={"part7_1"} accessibilityLabel={"part7_1"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_7_1}
                        </Text>
                        
                        <Text testID={"subtitle8"} accessibilityLabel={"subtitle8"} style={styles.subtitle}>
                            {TERMS_AND_CONDITIONS_SUBTITLE_8}
                        </Text>
                        <Text testID={"part8_1"} accessibilityLabel={"part8_1"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_8_1}
                        </Text>

                        <Text testID={"subtitle9"} accessibilityLabel={"subtitle9"} style={styles.subtitle}>
                            {TERMS_AND_CONDITIONS_SUBTITLE_9}
                        </Text>
                        <Text testID={"part9_1"} accessibilityLabel={"part9_1"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_9_1}
                        </Text>
                        <Text testID={"part9_2"} accessibilityLabel={"part9_2"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_9_2}
                        </Text>
                        <Text testID={"part9_3"} accessibilityLabel={"part9_3"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_9_3}
                        </Text>
                        <Text testID={"part9_4"} accessibilityLabel={"part9_4"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_9_4}
                        </Text>

                        <Text testID={"subtitle10"} accessibilityLabel={"subtitle10"} style={styles.subtitle}>
                            {TERMS_AND_CONDITIONS_SUBTITLE_10}
                        </Text>
                        <Text testID={"part10_1"} accessibilityLabel={"part10_1"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_10_1}
                        </Text>
                        <Text testID={"part10_2"} accessibilityLabel={"part10_2"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_10_2}
                        </Text>

                        <Text testID={"subtitle11"} accessibilityLabel={"subtitle11"} style={styles.subtitle}>
                            {TERMS_AND_CONDITIONS_SUBTITLE_11}
                        </Text>
                        <Text testID={"part11_1"} accessibilityLabel={"part11_1"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_11_1}
                        </Text>

                        <Text testID={"subtitle12"} accessibilityLabel={"subtitle12"} style={styles.subtitle}>
                            {TERMS_AND_CONDITIONS_SUBTITLE_12}
                        </Text>
                        <Text testID={"part12_1"} accessibilityLabel={"part12_1"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_12_1}
                        </Text>
                        <Text testID={"part12_2"} accessibilityLabel={"part12_2"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_12_2}
                        </Text>
                        <Text testID={"part12_3"} accessibilityLabel={"part12_3"} style={styles.bodyText}>
                            {TERMS_AND_CONDITIONS_PART_12_3}
                        </Text>
                    </View>
                </Grid>
                <Grid>
                    <View style={styles.footerView}>
                        {loading && 
                            <Spinner testID='spinner' accessibilityLabel='spinner' color="#f16921" />
                        }
                        <Button testID={"btnAccept"} accessibilityLabel={"btnAccept"} bordered full
                            style={styles.acceptButton} onPress={() => handleAcept()} disabled={loading}>
                            <Text testID={"lblBtnAccept"} accessibilityLabel={"lblBtnAccept"} style={{ color: 'white', fontWeight: 'bold' }}>ACEPTAR</Text>
                        </Button>
                    </View>
                </Grid>
            </Content>

            <InfoModal isVisible={isErrModal} message={serviceError} 
                handleAccept={toggleErrModal} />
            
        </TouchableOpacity>
    );
}
