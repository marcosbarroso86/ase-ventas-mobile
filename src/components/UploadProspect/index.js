import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Keyboard } from "react-native";
import {
  Container,
  Content,
  Text,
  Button,
  Form,
  Item,
  Spinner,
  Icon,
  ListItem,
} from "native-base";
import { TextInputMask } from "react-native-masked-text";
import { RadioButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import genericStyles from '../../styles';
import styles from "./style";
import MenuBar from "../MenuBar";
import InfoModal from "../Modals/InfoModal";

import {
  MALE_GENDER,
  FEMALE_GENDER,
  EMPTY_CUIT,
  EMPTY_CUIL,
  WRONG_CUIL,
  WRONG_CUIT,
  PROSPECT_NOTIFICATION,
  USER_DATA,
  LONG_ANY_CHARACTER,
  COMPANY_NOT_SELECTED_ERROR,
} from "../../consts";

import { requestProspect } from "../../redux/api/prospects";
import { requestCompany, clearCuitArray } from "../../redux/ducks/companyDucks";
import { buildErrMssg, getItem, validateCuitInput } from "../../utils";
import { Entypo } from "@expo/vector-icons";

export default function UploadProspect({ navigation }) {
  const dispatch = useDispatch();

  const [cuil, setCUIL] = useState("");
  const [cuit, setCUIT] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gender, setGender] = useState(MALE_GENDER);
  const [errMssgCUIT, setErrMssgCUIT] = useState("");
  const [errMssgCUIL, setErrMssgCUIL] = useState("");
  const [isErrModal, setIsErrModal] = useState(false);
  const [user, setUser] = useState(null);
  const [commercialAnalystCod, setCommercialAnalystCod] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [unMounted, setUnMounted] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(false);
  const [loading, setLoading] = useState(false);

  const cuits = useSelector((store) => store.company.data);
  const errorCuits = useSelector((store) => store.company.error);

  useEffect(() => {
    return function cleanUp() {
      setUnMounted(true);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(clearCuitArray());
      clearAll();
    }, [])
  );

  useEffect(() => {
    if (!unMounted && errorCuits) {
      setServiceError(errorCuits);
      setIsErrModal(true);
    }
  }, [errorCuits]);

  useEffect(() => {
    if (!unMounted) {
      fetchUserData();
    }
  }, []);

  const parseCuit = (text) => {
    let parsedCuit = "" + text;
    if (parsedCuit.length === 11) {
      parsedCuit = `${parsedCuit.slice(0, 2)}-${parsedCuit.slice(
        2,
        10
      )}-${parsedCuit.slice(10)}`;
    } else {
      parsedCuit = text;
    }
    return parsedCuit;
  };

  const fetchUserData = async () => {
    const userDB = JSON.parse(await getItem(USER_DATA));
    setUser(userDB);
  };

  const validateEmptyInputs = (mssg) => {
    if (mssg.cuit || mssg.cuil) {
      if (mssg.cuil === EMPTY_CUIL || mssg.cuil === WRONG_CUIL) {
        cuilRef.getElement().focus();
        setErrMssgCUIL(mssg.cuil)
      }
      if (mssg.cuit === EMPTY_CUIT || mssg.cuit === WRONG_CUIT) {
        companyRef.getElement().focus();
        setErrMssgCUIT(mssg.cuit)
      }
      return
    }
    if (cuits && cuits.length > 0) {
      setErrMssgCUIT(COMPANY_NOT_SELECTED_ERROR)
      return
    }
    return true
  }

  const handleSendProcedure = async () => {
    clearErrMssg();

    var form = { cuit, cuil, gender };

    let mssg = buildErrMssg(form);
    if (!validateEmptyInputs(mssg)) return

    const payload = buildPayload();
    try {
      setLoading(true);
      const procedure = await requestProspect(payload);
      const parsedCuit = parseCuit(cuit);
      const params = { cuit: parsedCuit, cuil, businessName, procedure };
      clearAll();
      navigation.navigate(PROSPECT_NOTIFICATION, params);
    } catch (error) {
      setIsErrModal(true);
      setServiceError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const buildPayload = () => {
    let payload = {};
    const executive = {};
    executive.id = user.id;
    executive.email = user.email;
    executive.name = user.firstName;
    executive.lastName = user.lastName;
    executive.network = user.network;
    const companyExist = selectedCompany;

    payload = {
      cuil,
      cuit,
      gender,
      executive,
      commercialAnalystCod,
      companyExist,
    };
    return payload;
  };

  const clearErrMssg = () => {
    setErrMssgCUIL("");
    setErrMssgCUIT("");
  }

  const clearAll = () => {
    clearErrMssg()
    setCUIL("");
    setServiceError("");
    setSelectedCompany(false);
    setCUIT("");
    setBusinessName("");
    setCommercialAnalystCod("");
  };

  const handleChangeCUIT = (text) => {
    setCUIT(text);
    setErrMssgCUIT("");
    setSelectedCompany(false);
    setBusinessName('');
    setCommercialAnalystCod('');
    if (text.length <= 4) {
      dispatch(clearCuitArray());
    } else {
      dispatch(requestCompany(text));
    }
  };
  
  const handleBlurCuit = () => {
    if (cuits && cuits.length > 0) {
      setErrMssgCUIT(COMPANY_NOT_SELECTED_ERROR)
    }
  }

  const handleChangeCUIL = (text) => {
    setErrMssgCUIL("");
    setCUIL(text);
  };

  const toggleErrModal = () => {
    setIsErrModal(false);
  };

  const buildCuitMask = (text) => {
    const firstPart = text.toString().slice(0, 2);
    const secondPart = text.toString().slice(2, 10);
    const thirdPart = text.toString().slice(10, 11);
    return `${firstPart}-${secondPart}-${thirdPart}`;
  };

  const handlePressCompany = (company) => {
    if (company.promoter) {
      setCommercialAnalystCod(company.promoter.id);
    } else {
      setCommercialAnalystCod("");
    }
    setSelectedCompany(true);
    setErrMssgCUIT('');
    setBusinessName(company.businessName);
    setCUIT(buildCuitMask(company.cuit));
    dispatch(clearCuitArray());
    Keyboard.dismiss();
  };

  const formatName = (value) => {
    const formated = "" + value;
    return formated.trim();
  };

  const isEnabled = () => {
    return cuit && cuil
  }

  const handleClearCUIT = () => {
    setCUIT("");
    setErrMssgCUIT("")
    setBusinessName("");
    setSelectedCompany(false);
    setCommercialAnalystCod("");
    dispatch(clearCuitArray());
  }

  var companyRef = useRef(null);
  var cuilRef = useRef(null);

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
      <MenuBar
        onPress={() => {
          navigation.openDrawer();
          Keyboard.dismiss();
        }}
        navigation={navigation}
        rightVisible={false}
      />
      <Content contentContainerStyle={styles.flex}>
        <View style={styles.flex}>
          <ScrollView keyboardShouldPersistTaps="always" style={styles.flex}>
            <InfoModal
              isVisible={isErrModal}
              message={serviceError}
              handleAccept={toggleErrModal}
            />
            <Form style={styles.margin24}>
              <Text
                testID={"titleNewProcedure"}
                accessibilityLabel={"titleNewProcedure"}
                style={styles.textTitle}
              >
                INICIAR CONSULTA PROSPECT
              </Text>
              <View>
                <Item style={styles.itemBussinesName}>
                  <Text testID={"lblCompany"}
                    accessibilityLabel={"lblCompany"}
                    style={styles.textBusinessName}
                  >
                    {businessName}
                  </Text>
                </Item>
                  <View style={[styles.flex, styles.zIndex1]}>
                  <Item style={[styles.marginHoriz10,
                  errMssgCUIT !== ''
                  && styles.borderBottomColorRed
                  ]}>
                    <Item
                      style={styles.flexRow}
                    >
                      <TextInputMask
                        testID={"inputCompany"}
                        accessibilityLabel={"inputCompany"}
                        type={"custom"}
                        options={validateCuitInput(cuit)
                          ? {
                            mask: "99-99999999-9",
                          } : { mask: LONG_ANY_CHARACTER }}
                        value={cuit}
                        maxLength={
                          /^(20|23|24|27|30|33|34)(-[0-9]{8}-[0-9]{1})$/gm.test(cuit)
                            ? 13 : 40}
                        onChangeText={(text) => handleChangeCUIT(text)}
                        placeholder="Completá el CUIT o nombre de empresa"
                        style={[cuit ? styles.textCUIL : styles.textCUIT, styles.marginVert10]}
                        ref={(ref) => (companyRef = ref)}
                        onBlur={handleBlurCuit}
                      />
                    </Item>
                    {cuit !== '' && <Entypo id="clearCuitButton" name="cross" size={26} color="black" onPress={() => handleClearCUIT()} />}
                  </Item>
                  {(errMssgCUIT !== '') && (
                      <Item>
                        <Text
                          testID={"inputCuitError"}
                          accessibilityLabel={"inputCuitError"}
                          style={styles.textError}
                        >
                        {errMssgCUIT} &nbsp;
                          <Icon
                            style={styles.iconError}
                            name="ios-warning"
                          ></Icon>
                        </Text>
                      </Item>
                    )}
                    <Content>
                      {cuits &&
                        cuits.map((v, i) => {
                          return (
                            <ListItem key={i}>
                              <Text
                                testID={"companyOption" + i}
                                accessibilityLabel={"companyOption" + i}
                                onPress={() => handlePressCompany(v)}
                              >
                                {`${formatName(v.businessName)} - ${parseCuit(
                                  v.cuit
                                )}`}
                              </Text>
                            </ListItem>
                          );
                        })}
                    </Content>
                  </View>
                  <Item style={styles.marginHoriz10}>
                    <View style={[styles.flex, styles.viewSexChoice]}>
                      <Text>Sexo</Text>
                      <View style={[styles.flex, styles.viewSexRadioButton]}>
                        <RadioButton
                          testID={"radioMaleGender"}
                          accessibilityLabel={"radioMaleGender"}
                          value={gender}
                          status={
                            gender === MALE_GENDER ? "checked" : "unchecked"
                          }
                          onPress={() => {
                            setGender(MALE_GENDER);
                          }}
                          color={"#f16820"}
                          uncheckedColor={"black"}
                        />
                        <Text>{MALE_GENDER}</Text>

                        <RadioButton
                          testID={"radioFemaleGender"}
                          accessibilityLabel={"radioFemaleGender"}
                          value={gender}
                          status={
                            gender === FEMALE_GENDER ? "checked" : "unchecked"
                          }
                          onPress={() => {
                            setGender(FEMALE_GENDER);
                          }}
                          color={"#f16820"}
                          uncheckedColor={"black"}
                        />
                        <Text>{FEMALE_GENDER}</Text>
                      </View>
                    </View>
                  </Item>
                  <Item
                    style={
                    errMssgCUIL
                        ? [
                            styles.borderBottomColorRed,
                            styles.borderBottomWidth2,
                            styles.marginHoriz10,
                          ]
                        : [styles.marginHoriz10, { marginBottom: 10 }]
                    }
                  >
                    <TextInputMask
                      testID={"inputCuil"}
                      accessibilityLabel={"inputCuil"}
                      keyboardType="number-pad"
                      type={"custom"}
                      options={{
                        mask: "99-99999999-9",
                      }}
                      value={cuil}
                      onChangeText={(text) => handleChangeCUIL(text)}
                      placeholder="Completá el CUIL"
                      style={[styles.textCUIL, styles.marginVert10]}
                      ref={(ref) => (cuilRef = ref)}
                    />
                  </Item>
                {(errMssgCUIL === EMPTY_CUIL || errMssgCUIL === WRONG_CUIL) && (
                    <Item style={styles.itemCUILError}>
                      <Text
                        testID={"inputCuilError"}
                        accessibilityLabel={"inputCuilError"}
                        style={styles.textError}
                      >
                      {errMssgCUIL} &nbsp;
                        <Icon style={styles.iconError} name="ios-warning" />
                      </Text>
                    </Item>
                  )}
              </View>
            </Form>
          </ScrollView>
        </View>
          <View style={{ margin: 24 }}>
            <Button
              warning
            style={[styles.btnDefault, genericStyles.btnShadow, styles.btnStartProcedure, !isEnabled() && styles.disabled]}
            disabled={!isEnabled()}
              onPress={() => handleSendProcedure()}
            >
              <Text
                testID={"btnSendProcedure"}
                accessibilityLabel={"btnSendProcedure"}
                style={styles.textBtn}
              >
                CONSULTAR
              </Text>
            </Button>
        </View>
      </Content>
    </Container>
  );
}
