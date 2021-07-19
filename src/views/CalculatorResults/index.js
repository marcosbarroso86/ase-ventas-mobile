import React, { useState, useCallback, useEffect } from 'react';
import { Keyboard, KeyboardAvoidingView } from 'react-native';
import { Container, Grid, Item, Form, Button, Text, View } from 'native-base';

import genericStyles from '../../styles';
import styles from './style';
import MenuBar from "../../components/MenuBar";
import { TextInputMask, } from 'react-native-masked-text';
import { useFocusEffect } from '@react-navigation/native';
import { getLimit } from '../../redux/api/integrations';
import { ScrollView } from 'react-native-gesture-handler';
import InfoModal from '../../components/Modals/InfoModal';

export default function CalculatorResults({navigation}){

    const [inputSalary, setSalary] = useState('');
    const [crudeSalary, setCrudeSalary] = useState('')
    const [aseNeto, setAseNeto] = useState('');
    const [serviceError, setServiceError] = useState('');
    const [isErrModal, setIsErrModal] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setSalary('')
            setCrudeSalary('')
            setAseNeto('')
        }, [])
    );

    useEffect(() => {
        if (inputSalary == 0) setSalary('')
    }, [inputSalary])

    const handleCalculate = async () => {
        try {
            let salary = inputSalary;
            const { amount } = await getLimit();
            const maxSalary = amount;
            const percent = 0.03;
            const percentCont = 0.06;
            const percentAse = 0.8;
            let salaryAport = salary;

            if (salary > maxSalary) {
                salaryAport = maxSalary;
            }
            const res = calculate(salary, percent, percentCont, percentAse, salaryAport)
            setAseNeto(res)
            setCrudeSalary(inputSalary)
        } catch (error) {
            setIsErrModal(true);
            setServiceError(error.message);
        }
    }

    const toggleErrModal = () => {
        setIsErrModal(false);
    }

    const calculate = (salary, percent, percentCont, percentAse, salaryAport) => {
        let aporte = 0;
        let contribution = 0;
        let total = 0;
        let netoAse = 0;
        
        aporte = (salaryAport * percent);
        contribution = (salary * percentCont);
        total = aporte + contribution;
        netoAse = (total * percentAse);
        return netoAse;
    }

    return(
        <Container>
            <MenuBar
                onPress={() => {
                    navigation.openDrawer();
                    Keyboard.dismiss();
                }}
                navigation={navigation}
                rightVisible={false}

            />
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={70}>
                <Grid style={styles.centeredGrid}>
                    <Form style={styles.form}>
                        <Text
                            testID={"lblCalculationResultTitle"}
                            accessibilityLabel={"lblCalculationResultTitle"}
                            style={styles.textTitle}
                        >
                            CALCULAR APORTES
                        </Text>
                        <View style={{ flexGrow: 1 }}>
                            <View style={styles.salaryInputContainer}>
                                <Item style={styles.salaryInput}>
                                    <TextInputMask
                                        testID={"inputSalary"}
                                        style={styles.input}
                                        accessibilityLabel={"inputSalary"}
                                        keyboardType="decimal-pad"
                                        type={"money"}
                                        includeRawValueInChangeText={true}
                                        options={{
                                            precision: 2,
                                            separator: ',',
                                            delimiter: '.',
                                            unit: '$',
                                            suffixUnit: ''
                                        }}
                                        maxLength={15}
                                        value={inputSalary}
                                        onChangeText={(maskedText, rawText) => setSalary(rawText)}
                                        placeholder="Ingresá sueldo en BRUTO"
                                    />
                                </Item>
                            </View>
                            <View style={styles.resultsContainer}>
                                <Text style={styles.resultsTitle}>Resultado del cálculo</Text>
                                <View style={styles.resultsTextContainer}>
                                    <Item style={styles.resultsText}>
                                        <Text >Sueldo BRUTO: </Text>
                                        <TextInputMask editable={false}
                                            testID={"crudeSalaryText"}
                                            accessibilityLabel={"crudeSalaryText"}
                                            type={"money"}
                                            options={{
                                                precision: 2,
                                                separator: ',',
                                                delimiter: '.',
                                                unit: '$',
                                                suffixUnit: ''
                                            }}
                                            value={crudeSalary}
                                            rightVisible
                                            placeholder="$ -"
                                            placeholderTextColor="black"
                                        />
                                </Item>
                                    <Item style={styles.resultsText}>
                                        <Text >Neto ASE: </Text>
                                        <TextInputMask editable={false}
                                            testID={"netoSalaryText"}
                                            accessibilityLabel={"netoSalaryText"}
                                            type={"money"}
                                            options={{
                                                precision: 2,
                                                separator: ',',
                                                delimiter: '.',
                                                unit: '$',
                                                suffixUnit: ''
                                            }}
                                            value={aseNeto}
                                            rightVisible
                                            placeholder="$ -"
                                            placeholderTextColor="black"
                                        />
                                </Item>
                                </View>
                            </View>
                            </View>
                            <InfoModal
                                isVisible={isErrModal}
                                message={serviceError}
                                handleAccept={toggleErrModal}
                            />
                            <Button 
                                onPress={() => handleCalculate()} disabled={inputSalary === ''}
                                style={[genericStyles.btnShadow, !inputSalary && { opacity: 0.4 }, styles.button]}
                                >
                            <Text testID={"btnCalculate"} accessibilityLabel={"btnCalculate"}
                                style={genericStyles.textWhite}>CALCULAR</Text>
                            </Button>
                        </Form>
                    </Grid>  
                </KeyboardAvoidingView>
            </ScrollView>
        </Container>
    );
}

