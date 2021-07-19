import React, { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Switch, Image, Keyboard, Platform } from "react-native";
import {
  Container,
  Content,
  Text,
  Button,
  Form,
  Item,
  Card,
  CardItem,
  Spinner,
  Icon,
  ListItem,
  Picker,
} from "native-base";
import { TextInputMask } from "react-native-masked-text";
import { RadioButton } from "react-native-paper";
import { AntDesign, MaterialCommunityIcons, Entypo, Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView} from "react-native-gesture-handler";
import styles from "./style";
import style from "./style";
import MenuBar from "../MenuBar";
import InfoModal from "../Modals/InfoModal";
import {
  DEFAULT_GENDER,
  MALE_GENDER,
  FEMALE_GENDER,
  EMPTY_CUIT,
  EMPTY_CUIL,
  WRONG_CUIL,
  WRONG_CUIT,
  PROCEDURE_NOTIFICATION,
  USER_DATA,
  FILE_NOT_LOAD,
  TUTORIAL_PROCEDURE,
  INEXISTENT_IMAGE,
  INVALID_FILE_EXTENSION,
  VALID_IMAGE_EXTENSIONS,
  FORM_SENDED,
  CLEAR_INPUTS,
  INVALID_IMAGE_SIZE,
  INVALID_FILE_LENGTH,
  ATTACH_FILE_ERROR,
  FORM_01_INPUT,
  SECOND_FORM_INPUT,
  COMPANY_NOT_SELECTED_ERROR,
  LONG_ANY_CHARACTER,
  DELETE_CONFIRM,
  IOS_CAMERA_ERROR,
  STORAGE_PERMISSION_ERROR
} from "../../consts";

import Toast from 'react-native-root-toast';
import { requestSendForm, requestProcedure } from "../../redux/api/procedures";
import { requestCompany, clearCuitArray, requestCompanyFromProspect } from "../../redux/ducks/companyDucks";
import { buildErrMssg, eraseItem, getItem, validateCuitInput } from "../../utils";
import { deleteFile, existFile, validateFileExtension, validateFileNameLength, validateSize } from "../../utils/fileUtils";
import genericStyles from '../../styles';
import ConfirmModal from '../Modals/ConfirmModal';
import EmailModal from '../../components/Modals/EmailInfoModal'
import pdfImage from '../../../assets/display/pdf.png';

export default function UploadProcedure({ navigation }) {

  const dispatch = useDispatch();
  const [prospectId, setProspectId] = useState(null);
  const [document, setDocument] = useState({});
  const [document2, setDocument2] = useState({});
  const [cuil, setCUIL] = useState("");
  const [cuit, setCUIT] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gender, setGender] = useState(DEFAULT_GENDER);
  const [errMssgCUIT, setErrMssgCUIT] = useState("");
  const [errMssgCUIL, setErrMssgCUIL] = useState("");
  const [errMssgFILE, setErrMssgFILE] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState(null);
  const [commercialAnalistCod, setCommercialAnalistCod] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [unMounted, setUnMounted] = useState(false);
  const [masiveRegister, setMasiveRegister] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(false);
  const [source, setSource] = useState("1");
  const [loading, setLoading] = useState(false);
  const [editableInputs, setEditableInputs] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessageModal] = useState('');
  const [isSuccessModal, setSuccessModal] = useState(false);

  const cuits = useSelector((store) => store.company.data);
  const errorCuits = useSelector((store) => store.company.error);

  useEffect(() => {
    return function cleanUp() {
      setUnMounted(true);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setProspectId(null);
      const getProspect = async () => {
        setLoading(true);
        const prospect = JSON.parse(await getItem("PROSPECT"));
        if (prospect) {
          const companyResponse = await requestCompanyFromProspect(prospect.cuit);
          if (companyResponse) {
            if (companyResponse.promoter) {
              setCommercialAnalistCod(companyResponse.promoter.id);
            } else {
              setCommercialAnalistCod("");
            }
            setSelectedCompany(true);
            setBusinessName(companyResponse.businessName);
          }
          setCUIT(prospect.cuit);
          setEditableInputs(false);
          setCUIL(prospect.cuil);
          setProspectId(prospect.id);
          setGender(prospect.gender);
        }
        setLoading(false);
      };
      getProspect();
    }, [])
  );

  useEffect(() => {
    if (!unMounted && errorCuits) {
      setModalMessage(errorCuits);
      setOpenModal(true);
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

  const handleSendForm = async () => {
    try {
        const payload = buildPayloadEmail();
        const modalMssg = await requestSendForm(payload);
        if (modalMssg === FORM_SENDED) {
                setMessageModal(modalMssg)
                setSuccessModal(true)
        } 
    } catch (error) {
        setOpenModal(true);
      setModalMessage(error.message);
    }
  };

  const buildPayloadEmail = () => {
    let payload = {};
    payload.executiveID = user.id;
    payload.email = email;
    return payload
  };

  const fetchUserData = async () => {
    const userDB = JSON.parse(await getItem(USER_DATA));
    setEmail(userDB.email);
    setUser(userDB);
  };

  const clearErrMssg = () => {
    setErrMssgCUIL("");
    setErrMssgCUIT("");
    setErrMssgFILE("");
  }

  const validateEmptyInputs = (mssg) => {
    if (mssg.cuit || mssg.cuil || mssg.photo) {
      if (mssg.cuil === EMPTY_CUIL || mssg.cuil === WRONG_CUIL) {
        cuilRef.getElement().focus();
        setErrMssgCUIL(mssg.cuil)
      }
      if (mssg.cuit === EMPTY_CUIT || mssg.cuit === WRONG_CUIT) {
        companyRef.getElement().focus();
        setErrMssgCUIT(mssg.cuit)
      }
      setErrMssgFILE(mssg.photo);
      return
    }
    if (cuits && cuits.length > 0) {
      companyRef.getElement().focus();
      setErrMssgCUIT(COMPANY_NOT_SELECTED_ERROR)
      return
    }
    return true
  }

  const isEnabled = () => {
    return cuit && cuil && document.result && errMssgCUIT !== COMPANY_NOT_SELECTED_ERROR
  }

  const handleSendProcedure = async () => {
    clearErrMssg()
    var form = { cuit, cuil, gender, photo: document.result };

    let mssg = buildErrMssg(form);
    if (!validateEmptyInputs(mssg)) return
    
    if (!existFile(document.result)) {
      setOpenModal(true);
      setModalMessage(INEXISTENT_IMAGE);
      return;
    }
    const payload = buildPayload();
    try {
      setLoading(true);
      const procedure = await requestProcedure(payload);
      const parsedCuit = parseCuit(cuit);
      const params = { cuit: parsedCuit, cuil, businessName, procedure };
      if (document && document.result) deletePhoto(document.result.uri);
      if (document2 && document2.result) deletePhoto(document2.result.uri);
      
      await clearAll();
      navigation.navigate(PROCEDURE_NOTIFICATION, params);
      
    } catch (error) {
      setOpenModal(true);
      setModalMessage(error.message);
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
    const file = document.result;
    const companyExist = selectedCompany;
    payload = {
      cuil,
      cuit,
      gender,
      file,
      executive,
      commercialAnalistCod,
      companyExist,
      source,
    };
    if (source == 2 && document2.result) {
      payload.file2 = document2.result;
    }
    if (prospectId) {
      payload.prospectId = prospectId;
    }
    return payload;
  };

  const clearMassiveRegister = () => {
    setMasiveRegister(false);
    setSelectedCompany(false);
    setCUIT("");
    setBusinessName("");
    setSource("1");
    setCommercialAnalistCod("");
  }

  const clearAll = async () => {
    clearErrMssg();
    setCUIL("");
    setDocument({});
    setDocument2({});
    setGender(DEFAULT_GENDER)
    setModalMessage("");
    setEditableInputs(true);
    dispatch(clearCuitArray());
    setProspectId(null)
    await eraseItem("PROSPECT");
    if (!masiveRegister) {
      clearMassiveRegister();
    }
  };

  const handleChangeCUIT = (text) => {
    try {
      setCUIT(text);
      setErrMssgCUIT('');
      setBusinessName('');
      setSelectedCompany(false);
      setCommercialAnalistCod('')
      if (text.length <= 4) {
        dispatch(clearCuitArray());
      } else {
        dispatch(requestCompany(text));
      }
    } catch (error) {
      setModalMessage(error.message);
      setOpenModal(true);
    }
  };

  const handleChangeCUIL = (text) => {
    setErrMssgCUIL("");
    setCUIL(text);
  };

  const toggleErrModal = () => {
    setOpenModal(false);
    setModalMessage('');
  };

  const pickImageFromCamera = async (type) => {
    setErrMssgFILE("");
    try {
      const { status, canAskAgain } = await Camera.requestPermissionsAsync();
      if (status != 'granted') {
        if (!canAskAgain) {
          setOpenModal(true)
          setModalMessage(IOS_CAMERA_ERROR);
        }
        return
      }
      const cameraPermission = await ImagePicker.requestCameraRollPermissionsAsync();
      if (cameraPermission.status != 'granted') {
        if (!cameraPermission.canAskAgain) {
          setOpenModal(true)
          setModalMessage(STORAGE_PERMISSION_ERROR);
        }
        return
      }
      if (cameraPermission.status != "granted") return
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [16, 9],
        quality: 1,
      });
      if (result.cancelled) return;
      if (type === 1) setDocument({ result });
      if (type === 2) setDocument2({ result });
    } catch (error) {
      console.error(error);
    }
  };

  const pickDocumentFromDevice = async (type) => {
    setErrMssgFILE("");
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result && result.type !== "cancel") {
        if (!result.uri) {
          setOpenModal(true);
          setModalMessage(ATTACH_FILE_ERROR);
          return
        }
        if (!validateFileExtension(result)) {
          setOpenModal(true);
          setModalMessage(INVALID_FILE_EXTENSION);
          return;
        }
        if (!validateSize(result)) {
          setOpenModal(true);
          setModalMessage(INVALID_IMAGE_SIZE);
          return;
        }
        if (!validateFileNameLength(result)) {
          setOpenModal(true);
          setModalMessage(INVALID_FILE_LENGTH);
          return;
        }
        if (type === FORM_01_INPUT) setDocument({ result });
        if (type === SECOND_FORM_INPUT) setDocument2({ result });
      }
    } catch (error) {
      setOpenModal(true);
      setModalMessage(ATTACH_FILE_ERROR);
      console.error(error);
    }
  };

  const handleImage = (documentNumber) => {
    if (documentNumber && documentNumber.result) {
      const name = documentNumber.result.uri.split('.')
      const extension = name[name.length - 1].toLowerCase();
      if (!VALID_IMAGE_EXTENSIONS.includes(extension)) return pdfImage;
      return { uri: documentNumber.result.uri }
    }
  }

  const buildCuitMask = (text) => {
    const firstPart = text.toString().slice(0, 2);
    const secondPart = text.toString().slice(2, 10);
    const thirdPart = text.toString().slice(10, 11);
    return `${firstPart}-${secondPart}-${thirdPart}`;
  };

  const handleTutorialNavigate = () => {
    navigation.navigate(TUTORIAL_PROCEDURE);
  };

  const handleSwitchChange = (value) => {
    setMasiveRegister(value);
  };

  const deletePhoto = (uri) => {
    deleteFile(uri);
  };

  const handlePressCompany = (company) => {
    if (company.promoter) {
      setCommercialAnalistCod(company.promoter.id);
    } else {
      setCommercialAnalistCod("");
    }
    setErrMssgCUIT('');
    setSelectedCompany(true);
    setBusinessName(company.businessName);
    setCUIT(buildCuitMask(company.cuit));
    dispatch(clearCuitArray());
    Keyboard.dismiss();
  };

  const formatName = (value) => {
    const formated = "" + value;
    return formated.trim();
  };

  var companyRef = useRef(null);
  var cuilRef = useRef(null);

  const handleRefresh = () => {
    setModalMessage(DELETE_CONFIRM)
    setIsVisible(true);
  }

  const handleAccept = () => {
    clearAll();
    clearMassiveRegister();
    setIsVisible(false);
    Toast.show(CLEAR_INPUTS, {
      duration: Toast.durations.SHORT,
    });
  };

  const handleCancel = () => {
    setIsVisible(false)
  }

  const handleClearImage = (inputNumber) => {
    if (inputNumber === FORM_01_INPUT) return setDocument({})
    return setDocument2({})
  }

  const handleClearCUIT = () => {
    setCUIT("");
    setErrMssgCUIT("")
    setBusinessName("");
    setSelectedCompany(false);
    setCommercialAnalistCod("");
    dispatch(clearCuitArray());
  }

  const handleBlurCuit = () => {
    if (cuits && cuits.length > 0) {
      setErrMssgCUIT(COMPANY_NOT_SELECTED_ERROR)
    }
  }

  const toggleSuccessModal = () => {
    setSuccessModal(false);
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
      <MenuBar
        onPress={() => {
          navigation.openDrawer();
          Keyboard.dismiss();
        }}
        navigation={navigation}
      />
      <Content contentContainerStyle={styles.flex}>
        <View style={[{ alignItems: 'flex-end', marginRight: 10 }, Platform.OS !== 'android' && { zIndex: 2 }]}>
          <Button id="clearAllButton" rounded onPress={handleRefresh} style={[styles.touchableOpacityStyle, { zIndex: 3 }]}>
              <Icon name='refresh' testID={"btnClearForm"} accessibilityLabel={"btnClearForm"} />
            </Button>
          </View>
        <View style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="always" style={styles.flex}>
            <Form style={styles.margin24}>
              <Text
                testID={"titleNewProcedure"}
                accessibilityLabel={"titleNewProcedure"}
                style={styles.textTitle}
              >
                INICIAR NUEVA GESTIÓN
              </Text>
                <View>
                  <View style={[styles.flex, styles.zIndex1]}>
                    <Item 
                      style={[
                      errMssgCUIT !== ''
                            ? styles.borderBottomColorRed
                            : {},
                          styles.itemBussinesName,
                      ]}>
                      <Text testID={"lblCompany"} 
                        accessibilityLabel={"lblCompany"}
                        style={styles.textBusinessName} 
                      >
                        {businessName}  
                      </Text>
                  </Item>
                  <Item style={[styles.marginHoriz10,
                  errMssgCUIT !== ''
                    && styles.borderBottomColorRed
                  ]}>
                    <Item
                      style={styles.flexRow}
                    >
                      <TextInputMask editable={editableInputs}
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
                        style={[!editableInputs && styles.disabledInput, cuit ? styles.textCUIL : styles.textCUIT, styles.marginVert10]}
                        ref={(ref) => (companyRef = ref)}
                        onBlur={handleBlurCuit}
                      />
                    </Item>
                    {cuit !== '' && !prospectId && <Entypo name="cross" size={26} color="black" id="clearCuitButton" onPress={() => handleClearCUIT()} />}
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
                    {!prospectId && cuits &&
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
                  <Switch disabled={!editableInputs}
                      testID={"checkboxMultipleCompany"}
                      accessibilityLabel={"checkboxMultipleCompany"}
                      onValueChange={(value) => handleSwitchChange(value)}
                      style={styles.marginVert16}
                      value={masiveRegister}
                    />
                    <Text
                      testID={"textMultipleCompany"}
                      accessibilityLabel={"textMultipleCompany"}
                    >
                      Alta múltiple de la misma empresa
                    </Text>
                  </Item>
                  <Item style={styles.marginHoriz10}>
                    <View style={[styles.flex, styles.viewSexChoice]}>
                      <Text testID={"textSex"} accessibilityLabel={"textSex"}>
                      Género
                      </Text>
                      <View style={[styles.flex, styles.viewSexRadioButton]}>
                      <RadioButton disabled={!editableInputs}
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

                      <RadioButton disabled={!editableInputs}
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
                  <Item style={styles.marginHoriz10}>
                  <Picker enabled={editableInputs}
                      testID={"selectHealthInsurance"}
                      accessibilityLabel={"selectHealthInsurance"}
                      note
                    iosHeader="Seleccione"
                    headerBackButtonText="Volver"
                      mode="dropdown"
                      selectedValue={source}
                      onValueChange={(value) => setSource(value)}
                    >
                      <Picker.Item label="ASE" value="1" />
                      <Picker.Item label="Otra Obra Social" value="2" />
                    </Picker>
                  </Item>
                  <Item
                    style={
                    errMssgCUIL
                        ? [
                        styles.borderBottomColorRed,
                            styles.marginHoriz10,
                          ]
                        : [styles.marginHoriz10, { marginBottom: 10 }]
                    }
                  >
                  <TextInputMask editable={editableInputs}
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
                      style={[!editableInputs && styles.disabledInput, styles.textCUIL, styles.marginVert10]}
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
                  <Item style={[styles.margin10, styles.borderBottomWidth0]}>
                    <Card
                      style={
                      errMssgFILE
                          ? styles.cardPictureError
                          : style.cardPicture
                      }
                    >
                      <CardItem>
                      {document.result && (document.result.type === "image" || document.result.type === "success") ? (
                        <View style={styles.viewContainer}>
                          <Image
                            source={handleImage(document)}
                            style={styles.imgPhoto}
                          />
                          <Button style={styles.close} size={25} testID={"clearImageButton1"}
                            accessibilityLabel={"clearImageButton1"} onPress={() => handleClearImage(1)}>
                            <Ionicons name="ios-close-circle" size={30} style={Platform.OS === 'ios' && styles.deleteImage} color="tomato" />
                          </Button>
                        </View>
                        ) : (
                          <Text
                            testID={"lblPhotoName1"}
                            accessibilityLabel={"lblPhotoName1"}
                          >
                            {document.result
                              ? document.result.name
                                : "Subir formulario 01"}
                          </Text>
                          )}
                      </CardItem>
                    </Card>
                  </Item>
                {errMssgFILE === FILE_NOT_LOAD && (
                  <Item style={[styles.imageTextError, styles.borderBottomWidth0]}>
                      <Text style={styles.textError}>
                      {errMssgFILE} &nbsp;
                        <Icon style={styles.iconError} name="ios-warning" />
                      </Text>
                    </Item>
                  )}
                  <View style={styles.viewTakePicture}>
                    <View style={[styles.flex, styles.width50]}>
                      <Button
                        testID={"btnCamera1"}
                        accessibilityLabel={"btnCamera1"}
                        warning
                        style={[styles.btnTakePicture, styles.btnCamera]}
                        onPress={() => pickImageFromCamera(1)}
                      >
                        <AntDesign
                          style={styles.iconTakePicture}
                          name="camera"
                          size={20}
                          color="black"
                        />
                        <Text
                          testID={"lblBtnCamera1"}
                          accessibilityLabel={"lblBtnCamera1"}
                          style={styles.textTakePicture}
                        >
                          TOMAR FOTO
                        </Text>
                      </Button>
                    </View>
                    <View style={[styles.flex, styles.width50]}>
                      <Button
                        testID={"btnGallery1"}
                        accessibilityLabel={"btnGallery1"}
                        warning
                        style={[styles.btnTakePicture, styles.btnUpload]}
                      onPress={() => pickDocumentFromDevice(FORM_01_INPUT)}
                      >
                        <MaterialCommunityIcons
                          style={styles.iconTakePicture}
                          name="cloud-upload-outline"
                          size={20}
                          color="black"
                        />
                        <Text
                          testID={"lblBtnGallery1"}
                          accessibilityLabel={"lblBtnGallery1"}
                          style={styles.textTakePicture}
                        >
                          SUBIR ARCHIVO
                        </Text>
                      </Button>
                    </View>
                  </View>
                  {source !== "1" && (
                    <Item style={[styles.margin10, styles.borderBottomWidth0]}>
                      <Card
                        style={
                        errMssgFILE
                            ? styles.cardPictureError
                            : style.cardPicture
                        }
                      >
                        <CardItem>
                          {document2.result &&
                          (document2.result.type === "image" || document2.result.type === 'success')  ? (
                            <View style={styles.viewContainer}>
                              <Image
                                source={handleImage(document2)}
                                style={styles.imgPhoto}
                              />
                              <Button style={styles.close} size={25} testID={"clearImageButton2"}
                                accessibilityLabel={"clearImageButton2"} onPress={() => handleClearImage(2)}>
                                <Ionicons name="ios-close-circle" size={30} style={Platform.OS === 'ios' && styles.deleteImage} color="tomato" />
                              </Button>
                            </View>
                          ) : (
                            <Text
                              testID={"lblPhotoName2"}
                              accessibilityLabel={"lblPhotoName2"}
                            >
                              {document2.result
                                ? document2.result.name
                                  : "Subir otro archivo (opcional)"}
                            </Text>
                          )}
                        </CardItem>
                      </Card>
                    </Item>
                  )}
                {source !== "1" && errMssgFILE === FILE_NOT_LOAD && (
                  <Item style={[styles.imageTextError, styles.borderBottomWidth0]}>
                      <Text style={styles.textError}>
                      {errMssgFILE} &nbsp;
                        <Icon style={styles.iconError} name="ios-warning" />
                      </Text>
                    </Item>
                  )}
                  {source !== "1" && (
                    <View style={styles.viewTakePicture}>
                      <View style={[styles.flex, styles.width50]}>
                        <Button
                          disabled={document.result ? false : true}
                          testID={"btnCamera2"}
                          accessibilityLabel={"btnCamera2"}
                          warning
                          style={[
                            styles.btnTakePicture,
                            styles.btnCamera,
                            { opacity: document.result ? 1 : 0.3 },
                          ]}
                        onPress={() => pickImageFromCamera(SECOND_FORM_INPUT)}
                        >
                          <AntDesign
                            style={styles.iconTakePicture}
                            name="camera"
                            size={20}
                            color="black"
                          />
                          <Text
                            testID={"lblBtnCamera2"}
                            accessibilityLabel={"lblBtnCamera2"}
                            style={styles.textTakePicture}
                          >
                            TOMAR FOTO 2
                          </Text>
                        </Button>
                      </View>
                      <View style={[styles.flex, styles.width50]}>
                        <Button
                          disabled={document.result ? false : true}
                          testID={"btnGallery2"}
                          accessibilityLabel={"btnGallery2"}
                          warning
                          style={[
                            styles.btnTakePicture,
                            styles.btnUpload,
                            { opacity: document.result ? 1 : 0.3 },
                          ]}
                          onPress={() => pickDocumentFromDevice(2)}
                        >
                          <MaterialCommunityIcons
                            style={styles.iconTakePicture}
                            name="cloud-upload-outline"
                            size={20}
                            color="black"
                          />
                          <Text
                            testID={"lblBtnGallery2"}
                            accessibilityLabel={"lblBtnGallery2"}
                            style={styles.textTakePicture}
                          >
                            SUBIR ARCHIVO 2
                          </Text>
                        </Button>
                      </View>
                    </View>
                  )}

                  <Button
                    testID={"btnSendProcedure"}
                    accessibilityLabel={"btnSendProcedure"}
                    warning
                  style={[styles.btnDefault, genericStyles.btnShadow, styles.btnStartProcedure, !isEnabled() && styles.disabled]}
                  disabled={!isEnabled()}
                    onPress={() => handleSendProcedure()}
                  >
                    <Text
                      testID={"lblBtnSendProcedure"}
                      accessibilityLabel={"lblBtnSendProcedure"}
                      style={styles.textBtn}
                    >
                      COMENZAR GESTIÓN
                    </Text>
                  </Button>

                  <Button
                    testID={"btnTutorial"}
                    accessibilityLabel={"btnTutorial"}
                    bordered
                    style={[styles.btnDefault, styles.btnPictureTutorial]}
                    disabled={loading}
                    onPress={() => handleTutorialNavigate()}
                  >
                    <Text
                      testID={"lblBtnTutorial"}
                      accessibilityLabel={"lblBtnTutorial"}
                      style={[styles.textBtn, { color: "#f16820" }]}
                    >
                      TUTORIAL: FOTO AL FORMULARIO
                    </Text>
                  </Button>

                    <Button
                      testID={"btnSendForm"}
                      accessibilityLabel={"btnSendForm"}
                      disabled
                      light
                    style={[styles.btnDefault, genericStyles.btnShadow, styles.btnSendEmail]}
                      disabled={loading}
                      onPress={() => handleSendForm()}
                    >
                      <Text
                        testID={"lblBtnSendForm"}
                        accessibilityLabel={"lblBtnSendForm"}
                        style={[styles.textBtn, { color: "white" }]}
                      >
                      ENVIAR FORMULARIO
                      </Text>
                </Button>

                  <InfoModal
                    isVisible={openModal}
                    message={modalMessage}
                    handleAccept={toggleErrModal}
                  />
                  <ConfirmModal
                    isVisible={isVisible}
                    message={modalMessage}
                    handleAccept={handleAccept}
                    handleCancel={handleCancel}
                  />
                  <EmailModal 
                    isVisible={isSuccessModal} 
                    message={message} 
                    email={email} 
                    handleAccept={toggleSuccessModal} />

              </View>
            </Form>
          </ScrollView>
        </View>
      </Content>
    </Container>
  );
}
