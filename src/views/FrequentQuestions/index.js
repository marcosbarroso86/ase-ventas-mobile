import React, { useCallback, useState } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import { Accordion, Container, Header, Icon, Text, View, Spinner, Button } from 'native-base';
import { Keyboard, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MenuBar from "../../components/MenuBar";
import { getFrecuentQuestions } from '../../redux/api/executive';
import styles from './style';
import { LOGIN } from '../../consts';
import InfoModal from '../../components/Modals/InfoModal';

export default function FrequentQuestions ({route, navigation}) {
    const [question, setQuestion] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isErrModal, setIsErrModal] = useState(false);
    const [serviceError, setServiceError] = useState('');
    
    const ruta = route.params ? route.params.sourceView : route.name;

    useFocusEffect(
        useCallback(() => {
          async function fetchData() {
            await fetchQuestionData();
          }
          fetchData();
        }, [])
      );

    const fetchQuestionData = async () => {
        try {
            setLoading(true);
            const response = await getFrecuentQuestions();
            setQuestion(response)
        } catch (error) {
            setIsErrModal(true);
            setServiceError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleErrModal = () => {
        setIsErrModal(false);
        navigation.goBack();
    }

    const renderHeader = (question, expanded) => {
        return (
          <View style={styles.accordionHeader}>
            <View style={styles.accordionQuestion}>
                    <Text style={{ fontWeight: 'bold', position: 'absolute' }} testID={`lblQuestion`}>{question.question}</Text>
            </View>
            <View style={styles.buttonContainer}>
                {expanded
                    ? <Icon size={20} testID={`btnCollapseRemove`} name="remove" />
                    : <Icon size={20} testID={`btnCollapseAdd`} name="add" />}
            </View>
          </View>
        )
    }

    const renderContent = (item) => {
        const resp = item.answer;
        const resPlatform = resp.split('|');
        return (
          <View style={styles.accordionItems}>
                {(resPlatform.length > 1 && Platform.OS === 'ios') ? (
                <View style={styles.accordionItemValue}>                    
                    <Text style={styles.accordionItemValueName} testID={`lblAnswerAndroid`}>
                            {resPlatform[1]}
                    </Text>
                </View>
                ) : (
                    <View style={styles.accordionItemValue}>                    
                        <Text style={styles.accordionItemValueName} testID={`lblAnswerIos`}>
                                {resPlatform[0]}
                        </Text>
                    </View>
                )}
          </View>
        )
    }

    const handleClose = () => {
        navigation.navigate(LOGIN)
    }
        
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
            {(ruta === 'Login') ? (
               <> 
               <View style={{flex:1, width: "100%"}}>
                   <Header style={styles.header} androidStatusBarColor={"#e45205"}>
                            <View style={styles.contentIcon}>
                                <Button onPress={handleClose} style={{ width: '40%', height: '100%' }} large transparent>
                                    <Icon
                                        testID={"backButtonDrawer"} accessibilityLabel={"backButtonDrawer"}
                                        style={{ marginLeft: 5, color: 'black' }} size={24} name="arrow-back"

                                    />
                                </Button>
                        </View>
                        <View style={styles.contentTitle}>
                            <Text style={styles.title} testID={'lblTitleFrequentQuestions'}> Preguntas frecuentes</Text>
                        </View>
                   </Header>
                    <ScrollView keyboardShouldPersistTaps="always" style={{flex: 1}}>
                        <View>
                            <View style={styles.containerAccordion}>
                                <View style={styles.accordion}>
                                    <Accordion 
                                        dataArray={question}
                                        style={styles.accordionItems}
                                        renderHeader={renderHeader}
                                        renderContent={renderContent}
                                    />
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
               </>
            ) : (
                    <>
                        <MenuBar
                            onPress={() => {
                                navigation.openDrawer();
                                Keyboard.dismiss();
                            }}
                            title='Preguntas frecuentes'
                            navigation={navigation}
                            rightVisible={false}
                        />  
                        <ScrollView keyboardShouldPersistTaps="always" style={{flex: 1}}>
                            <View style={styles.container}>
                                <View style={styles.accordion}>
                                    <Accordion 
                                        dataArray={question}
                                        style={styles.accordionItems}
                                        renderHeader={renderHeader}
                                        renderContent={renderContent}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </>
            )}
            <InfoModal isVisible={isErrModal} message={serviceError} handleAccept={toggleErrModal}
                buttonText="ACEPTAR" />

        </Container> 
    )
}
