import React, { useState, useCallback, useEffect } from "react";
import { Image, Text, TextInput, Keyboard } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  Container,
  Content,
  Grid,
  Item,
  Form,
  Picker,
  Button,
  Icon,
  View,
  Spinner,
  ListItem,
} from "native-base";
import { TextInputMask } from "react-native-masked-text";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";

import genericStyles from "../../styles";
import styles from "./style";

import InfoModal from "../../components/Modals/InfoModal";
import { LONG_ANY_CHARACTER, NOTIFICATIONS, NOTIFICATIONS_NOT_FOUND, USER_DATA, WRONG_CUIL, WRONG_CUIT } from "../../consts";
import { getNotifications } from "../../redux/api/notifications";
import { requestCompany, clearCuitArray } from "../../redux/ducks/companyDucks";
import {
  getStates,
  setInitialStateWorkflow,
} from "../../redux/ducks/workflowDucks";
import { buildErrMssg, getItem, validateCuitInput } from "../../utils";
import MenuBar from "../../components/MenuBar";
import {  Entypo } from "@expo/vector-icons";


export default function NotificationFilters({ navigation }) {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [cuit, setCuit] = useState("");
  const [cuil, setCuil] = useState("");
  const [procedureNumber, setProcedureNumber] = useState("");
  const [workflow, setWorkflow] = useState(undefined);

  const [unmounted, setUnmounted] = useState(false);

  const [messageError, setMessageError] = useState("");
  const [existError, setExistError] = useState(false);
  const [errMssgCUIT, setErrMssgCUIT] = useState("");
  const [errMssgCUIL, setErrMssgCUIL] = useState("");
  const [loading, setLoading] = useState(true);

  const cuits = useSelector((store) => store.company.data);
  const statesUnsorted = useSelector((store) => store.workflow.data);
  const errorWorkflow = useSelector((store) => store.workflow.error);
  const successWorkflow = useSelector((store) => store.workflow.success);

  //TODO: HABRIA QUE ORDENAR LA QUERY, EL SERVICIO TENDRIA QUE TENER LA RESPONSABILIDAD DE ORDENAR
  const statesArray = statesUnsorted
    ? [
        { name: "Seleccionar..." },
        ...statesUnsorted.sort((a, b) => (a.name > b.name ? 1 : -1)),
      ]
    : [{ name: "Seleccionar..." }];

  useFocusEffect(
    useCallback(() => {
      clearAll();
      setWorkflow(undefined)
    }, [])
  );

  useEffect(() => {
    return function cleanUp() {
      setUnmounted(true);
    };
  }, []);

  useEffect(() => {
    if (!unmounted && errorWorkflow) {
      setMessageError(errorWorkflow);
      setExistError(true);
      setLoading(false);
      dispatch(setInitialStateWorkflow());
    }
  }, [errorWorkflow]);

  useEffect(() => {
    if (!unmounted && successWorkflow) {
      setLoading(false);
    }
  }, [successWorkflow]);

  useEffect(() => {
    if (!unmounted && (!statesUnsorted || statesUnsorted.length === 0)) {
      let params = {};
      params.id = { in: [1, 2, 3, 4, 5, 7, 8] };
      dispatch(getStates(params));
    }
  }, [statesUnsorted]);

  useEffect(() => {
    if (!unmounted) {
      fetchUserData();
    }
  }, []);

  const buildCuitMask = (text) => {
    const firstPart = text.toString().slice(0, 2);
    const secondPart = text.toString().slice(2, 10);
    const thirdPart = text.toString().slice(10, 11);

    return `${firstPart}-${secondPart}-${thirdPart}`;
  };

  const clearCuit = () => {
    dispatch(clearCuitArray());
  };

  const toggleErrModal = () => {
    setExistError(false);
  };

  const fetchUserData = async () => {
    const userDB = JSON.parse(await getItem(USER_DATA));
    setUser(userDB);
  };

  const handleChangeCuit = (text) => {
    try {
      setCuit(text);
      setBusinessName("");
      setErrMssgCUIT("");
      if (text.length <= 4) {
        dispatch(clearCuitArray());
      } else {
        dispatch(requestCompany(text));
      }
    } catch (error) {
      setExistError(true);
      setMessageError(error.message);
    }
  };

  const handlePress = (item) => {
    setCuit(buildCuitMask(item.cuit));
    setBusinessName(item.businessName);
    dispatch(clearCuitArray());
  };

  const handleChangeCUIL = (text) => {
    setCuil(text);
    setErrMssgCUIL("");
  };

  const handleChangeProcedureNumber = (value) => {
    if (value.replace(/[^0-9]/g, "").length <= 10) {
      setProcedureNumber(value.replace(/[^0-9]/g, ""));
    }
  };

  const handleChangeWorkflow = (newWorkflow) => {
    console.log(newWorkflow)
    setWorkflow(newWorkflow);
  };

  const validateInputs = () => {
    var form = { cuit, cuil };
    let mssg = buildErrMssg(form);
    if (mssg.cuit === WRONG_CUIT || mssg.cuil === WRONG_CUIL) {
      if (mssg.cuil === WRONG_CUIL) {
        setErrMssgCUIL(mssg.cuil)
      }
      if (mssg.cuit === WRONG_CUIT) {
        setErrMssgCUIT(mssg.cuit)
      }
      return
    }
    return true;
  }


  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      if (!validateInputs()) return
      if (procedureNumber > 2147483647) {
        setMessageError(NOTIFICATIONS_NOT_FOUND);
        setExistError(true);
        return
      }
      const params = buildParams();
      const response = await getNotifications(params, 1, 10);
      dispatch(clearCuitArray());
      if (response.data.length !== 0) {
        navigation.navigate(NOTIFICATIONS, {
          notifications: response.data,
          pagination: response.metadata,
          params,
        });
      }
      else {
        setMessageError(NOTIFICATIONS_NOT_FOUND);
        setExistError(true);
      }
    } catch (error) {
      setExistError(true);
      setMessageError(error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };
  
  const clearAll = () => {
    dispatch(clearCuitArray());
    setProcedureNumber("");
    setBusinessName("");
    setCuil("");
    setCuit("");
    setWorkflow("");
    setMessageError("");
    setErrMssgCUIT("");
    setErrMssgCUIL("");
  };

  const buildParams = () => {
    let params = {};

    if (cuit) params.cuit = { like: cuit };
    if (cuil) params.cuil = { like: cuil };
    if (workflow) params.state = { eq: workflow };
    if (procedureNumber) params.procedure = { eq: procedureNumber };
    if (user) params.executive = { eq: user.id };

    return params;
  };

  const clearBusinessName = () => {
    setCuit("");
    setBusinessName("");
    dispatch(clearCuitArray());
    setErrMssgCUIT("");
  }

  return (
    <Container>
      <MenuBar
        onPress={() => {
          navigation.openDrawer();
          Keyboard.dismiss();
        }}
        title="Notificaciones"
        navigation={navigation}
        rightVisible={false}
      />
      <Content contentContainerStyle={[styles.content]}>
        <Grid style={genericStyles.centeredGrid}>
          <View>
            <ScrollView keyboardShouldPersistTaps="always" style={styles.flex}>
              <View style={{ justifyContent: "center", minHeight: 80, paddingVertical: 30 }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    testID={"imgLogo"}
                    accessibilityLabel={"imgLogo"}
                    source={require("../../../assets/ase_nacional_blanco_imagen_app.png")}
                    style={{ width: 140, height: 45 }}
                  />
                </View>
              </View>
              <Form style={genericStyles.form}>
                {!loading ? (
                  <>
                    <View style={[styles.flex, styles.zIndex1]}>
                      <Text
                        testID={"lblNotificationsTitle"}
                        accessibilityLabel={"lblNotificationsTitle"}
                        style={styles.subtitle}
                      >
                        Aplicar filtros en notificaciones
                      </Text>
                      <Item
                        style={[
                          errMssgCUIT !== ''
                            ? styles.borderBottomColorRed
                            : {},
                          styles.itemBusinessName,
                        ]}>
                        <Text testID={"lblCompany"}
                          accessibilityLabel={"lblCompany"}
                          style={styles.textBusinessName}
                        >
                          {businessName}
                        </Text>
                      </Item>
                      <Item>
                        <Item style={styles.itemInputCuit}>
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
                          onChangeText={(text) => handleChangeCuit(text)}
                          placeholder="Por CUIT o empresa"
                          placeholderTextColor="#E7E7E7"
                            style={styles.inputCompany}
                          onBlur={() => { clearCuit() }}
                        />
                      </Item>
                        <Item style={styles.itemCross}>
                          {cuit !== '' && <Entypo name="cross" size={28} color="white" id="clearCuitButton" onPress={() => clearBusinessName()} />}
                        </Item>
                      </Item>
                      {(errMssgCUIT !== '') && (
                        <Item style={styles.marginHoriz10}>
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
                          cuits.map((item, index) => {
                            return (
                              <ListItem key={index}>
                                <Text
                                  testID={"companyOption" + index}
                                  accessibilityLabel={"companyOption" + index}
                                  onPress={() => handlePress(item)}
                                  style={{
                                    color: "white",
                                    backgroundColor: "#a9a9a9",
                                  }}
                                >
                                  {buildCuitMask(item.cuit)} {item.businessName}
                                </Text>
                              </ListItem>
                            );
                          })}
                      </Content>
                      <Item style={[styles.borderBottom, errMssgCUIL !== ''
                        && styles.borderBottomColorRed]}>
                        <TextInputMask
                          testID={"inpCuil"}
                          accessibilityLabel={"inpCuil"}
                          keyboardType="number-pad"
                          type={"custom"}
                          options={{ mask: "99-99999999-9" }}
                          value={cuil}
                          onChangeText={(text) => handleChangeCUIL(text)}
                          placeholder="Por CUIL"
                          placeholderTextColor="#E7E7E7"
                          style={styles.cuitInput}
                        />
                      </Item>
                      {(errMssgCUIL !== '') && (
                        <Item style={styles.marginHoriz10}>
                          <Text
                            testID={"inputCuitError"}
                            accessibilityLabel={"inputCuitError"}
                            style={styles.textError}
                          >
                            {errMssgCUIL} &nbsp;
                          <Icon
                              style={styles.iconError}
                              name="ios-warning"
                            ></Icon>
                          </Text>
                        </Item>
                      )}
                      <Item
                        style={styles.borderBottom}
                      >
                        <Text style={{ textAlign: "left", color: "white" }}>
                          Estado
                        </Text>
                        <Picker
                          testID={"ddlState"}
                          accessibilityLabel={"ddlState"}
                          mode="dropdown"
                          placeholder="Seleccionar..."
                          placeholderStyle={{ color: "white" }}
                          iosHeader="Seleccione"
                          headerBackButtonText="Volver"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{ width: "100%", color: "white" }}
                          textStyle={{ color: 'white' }}
                          selectedValue={workflow}
                          onValueChange={(itemValue) =>
                            handleChangeWorkflow(itemValue)
                          }
                        >
                          {statesArray &&
                            statesArray.map((v, i) => (
                              <Picker.Item
                                label={v.name}
                                value={v.id}
                                key={i}
                              />
                            ))}
                        </Picker>
                      </Item>

                      <Item style={styles.borderBottom}>
                        <TextInput
                          testID={"inpProcedure"}
                          accessibilityLabel={"inpProcedure"}
                          keyboardType="number-pad"
                          type={"custom"}
                          placeholder="Por # de gestión"
                          placeholderTextColor="#E7E7E7"
                          style={{
                            fontSize: 16,
                            height: 40,
                            justifyContent: "flex-start",
                            marginTop: 2,
                            color: "white",
                            width: "100%",
                          }}
                          onChangeText={(text) =>
                            handleChangeProcedureNumber(text)
                          }
                          value={procedureNumber}
                        />
                      </Item>
                      <Button
                        style={[
                          styles.button, genericStyles.btnShadow,
                          {
                            backgroundColor: "#F16921",
                            borderColor: "#F16820",
                            margin: 24,
                          },
                        ]}
                        onPress={() => handleApplyFilters()}
                      >
                        <Text
                          testID={"btnApplyFilters"}
                          accessibilityLabel={"btnApplyFilters"}
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontWeight: "bold",
                            borderRadius: 4,
                            color: "white",
                          }}
                        >
                          APLICAR FILTROS
                        </Text>
                      </Button>
                    </View>
                  </>
                ) : (
                  <Spinner
                    testID="spinner"
                    accessibilityLabel="spinner"
                    color="#f16921"
                  />
                )}
              </Form>
              <InfoModal
                isVisible={existError}
                message={messageError}
                handleAccept={toggleErrModal}
              />
            </ScrollView>
          </View>
        </Grid>
      </Content>
    </Container>
  );
}
