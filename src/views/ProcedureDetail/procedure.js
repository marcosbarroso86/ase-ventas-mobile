import React, { useEffect, useState } from "react";
import { Dimensions, ImageBackground, Platform, TouchableOpacity, View } from "react-native";
import {
  Container,
  Content,
  Header,
  Button,
  Left,
  Grid,
  Text,
  Card,
  CardItem,
  Body,
  Icon,
  Spinner,
  Right,
} from "native-base";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import genericStyles from '../../styles';
import styles from "./style";

import InfoModal from "../../components/Modals/InfoModal";
import {
  FILE_DOWNLOADED_SUCCESS, FILE_DOWNLOADED_ERROR,
  FULLSCREEN_IMAGE,
  FULLSCREEN_FILE,
  NOTIFICATIONS,
  VALID_IMAGE_EXTENSIONS,
  STORE_PERMISSION_ERROR,
  HOME,
} from "../../consts";
import { buildEndpoint, getProcedureBaseUrl } from "../../redux/api";
import { getCompanies } from "../../redux/api/integrations";
import { getNotifications } from "../../redux/api/notifications";
import { getProcedure } from "../../redux/api/procedures";
import { format, DATE_FORMAT_YYYY_MMMM_DD_HH_MM } from "../../utils/dateUtils";
import { checkInternetConnection, getStateColor, replaceCharacters } from "../../utils";
import notAvailableImage from "../../../assets/image_not_available.jpg";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from "expo-media-library";

export default function Procedure({ navigation, route }) {
  const { id } = route.params;

  const [messageError, setMessageError] = useState("");
  const [messageErrorFile, setMessageErrorFile] = useState("");
  const [fileConfirmation, setFileConfirmation] = useState(false);

  const [existError, setExistError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [procedure, setProcedure] = useState(null);
  const [company, setCompany] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileLoading, setFileLoading] = useState({ 0: true, 1: true, 2: true, 3: true });

  const [downloadProgress, setDownloadProgress] = useState(null);

  const fetchProcedureData = async () => {
    try {
      setLoading(true);
      const response = await getProcedure({ id });
      setProcedure(response);
      fetchProcedureFile(response.forms);
      await fetchCompany(response.cuit);
    } catch (error) {
      setExistError(true);
      setMessageError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProcedureFile = (imageRoutes) => {
    if (imageRoutes) {
        const imagesURL = [];
        const filesURL = [];
        imageRoutes.forEach((element) => {
        const url = `${getProcedureBaseUrl()}${buildEndpoint(element.uri)}`;
        if (VALID_IMAGE_EXTENSIONS.includes(element.extension)) {
          imagesURL.push(url);
        } else if (element.extension == 'pdf') {
            filesURL.push(url);
          }
      });
      setFileUrl(filesURL);
      setImageUrl(imagesURL);
      return;
    }
    setImageUrl(notAvailableImage);
  };

  const fetchCompany = async (cuit) => {
    const params = { cuit: replaceCharacters(cuit) };
    await getCompanies(params, 1, 1, null)
      .then((companies) => {
          if (companies && companies.length) {
            const company = companies.find( company => company.idBranchOffice == 0);
            setCompany(company.businessName.trim());
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    navigation.addListener('beforeRemove', async (e) => {
      if (downloadProgress) {
        await cancelDownload();
      }
    })
  }, [navigation, downloadProgress])

  useEffect(() => {
    async function fetchData() {
      setFileLoading({ 0: true, 1: true, 2: true, 3: true });
      await fetchProcedureData();
    }
    fetchData();
  }, []);

  const handleSeeNotification = async (item) => {
    if (!item) return;
    try {
      setLoading(true);
      const params = { procedure: item.id };
      const orders = "id:desc";
      const response = await getNotifications(params, null, null, orders);
      navigation.navigate(NOTIFICATIONS, {
        notifications: response.data,
        pagination: response.metadata,
        params,
      });
    } catch (error) {
      setExistError(true);
      setMessageError(error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  const handleFullScreen = (image) => {
    navigation.navigate(FULLSCREEN_IMAGE, { id, image });
  };

  const handleFullScreenPdf = (file) => {
    navigation.navigate(FULLSCREEN_FILE, { id, file });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleErrorModal = () => {
    setExistError(false);
    setMessageError("");
    navigation.navigate(HOME);
  };

  const formattedDate = (aDate) => {
    return format(aDate, DATE_FORMAT_YYYY_MMMM_DD_HH_MM);
  };

  const getStateStyle = (state) => {
    return state ? getStateColor(state.id) : {};
  };

  const downloadFile = async (item) => {
    setLoading(true);
    try {
      await checkInternetConnection();
      const { status, canAskAgain } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status != 'granted') {
        if (!canAskAgain) {
          setFileConfirmation(true)
          setMessageErrorFile(STORE_PERMISSION_ERROR);
        }
        return
      }
      const url = `${getProcedureBaseUrl()}${buildEndpoint(item.uri)}`;
      const { uri } = await FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory +
        item.description.substring(item.description.lastIndexOf("/") + 1)
      )
      await MediaLibrary.saveToLibraryAsync(uri);
      setMessageErrorFile(FILE_DOWNLOADED_SUCCESS);
      setFileConfirmation(true);
    } catch (error) {
      setMessageErrorFile(FILE_DOWNLOADED_ERROR);
      setFileConfirmation(true);
    }
    finally {
      setLoading(false);
    }
  };

  const callback = downloadProgress => {
    return downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
  };

  const cancelDownload = async () => {
    try {
      await downloadProgress.pauseAsync()
    } catch (error) {
      console.log(error)
    }
  }

  const shareFile = async (item) => {
    setLoading(true);
    try {
      await checkInternetConnection();
      const downloadResumable = FileSystem.createDownloadResumable(
        `${getProcedureBaseUrl()}${buildEndpoint(item.uri)}`,
        FileSystem.documentDirectory +
        item.description.substring(item.description.lastIndexOf("/") + 1),
        {},
        callback
      );
      setDownloadProgress(downloadResumable);
      const { uri } = await downloadResumable.downloadAsync();
      await Sharing.shareAsync(uri);
    } catch (error) {
      setMessageErrorFile(FILE_DOWNLOADED_ERROR);
      setFileConfirmation(true);
    } finally {
      setLoading(false);
    }
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
      <Header style={styles.header} androidStatusBarColor={"#e45205"}>
        <Left style={{ flex: 0.2 }}>
          <Button transparent onPress={() => handleGoBack()}>
            <Icon
              testID={"backToProcedureList"}
              accessibilityLabel={"backToProcedureList"}
              style={styles.icon}
              name="arrow-back"
              size={24}
            />
          </Button>
        </Left>
        <Body style={{ flex: 0.6, alignItems: "center" }}>
          <Text
            testID="textTitle"
            accessibilityLabel="textTitle"
            style={styles.headerTitle}
          >
            Gestión: {id}
          </Text>
        </Body>
        <Right style={{ flex: 0.2 }}></Right>
      </Header>
      <Content contentContainerStyle={[styles.content]}>
        <Grid style={{ marginLeft: 5, marginRight: 5 }}>
          <Grid>
            {procedure && (
              <Card key={"CardProcedure"} style={styles.cardContainer}>
                <CardItem
                  testID="cardHeader"
                  accessibilityLabel="cardHeader"
                  key="cardHeader"
                  style={styles.cardItemContainer}
                  cardBody
                >
                  <Body>
                    <Text
                      testID="textProcedureDetail"
                      accessibilityLabel="textProcedureDetail"
                      style={[styles.cardText, styles.cardTitleText]}
                    >
                      Gestión: #{procedure.id} {procedure.prospect ? ` - Prospect: #${procedure.prospect.id}` : null}
                    </Text>

                    <Text
                      testID="textDateDetail"
                      accessibilityLabel="textDateDetail"
                      style={styles.cardDate}
                    >
                      <AntDesign
                        name="clockcircleo"
                        size={12}
                        color="#b1bbb1"
                      />
                        &nbsp; Gestión iniciada{" "}
                      {formattedDate(procedure.creationDate)}
                    </Text>

                    <Text
                      testID="textStateDetail"
                      accessibilityLabel="textStateDetail"
                      style={{ paddingTop: 10 }}
                    >
                      <Text
                        testID="textStateLabelDetail"
                        accessibilityLabel="textStateLabelDetail"
                        style={styles.cardText}
                      >
                        Estado actual: &nbsp;
                        </Text>
                      <Text
                        testID="textStateValueDetail"
                        accessibilityLabel="textStateValueDetail"
                        style={[
                          getStateStyle(procedure.state),
                          styles.stateText,
                        ]}
                      >
                        {procedure.state.name}
                      </Text>
                    </Text>

                    <Text
                      testID="textCUITDetail"
                      accessibilityLabel="textCUITDetail"
                      style={{ paddingTop: 10 }}
                    >
                      <Text
                        testID="textCUITLabelDetail"
                        accessibilityLabel="textCUITLabelDetail"
                        style={styles.cardText}
                      >
                        CUIT: &nbsp;
                        </Text>
                      <Text
                        testID="textCUITValueDetail"
                        accessibilityLabel="textCUITValueDetail"
                        style={styles.cuitText}
                      >
                        {procedure.cuit} ({company})
                        </Text>
                    </Text>
                    <Text
                      testID="textCUILDetail"
                      accessibilityLabel="textCUILDetail"
                      style={{ paddingTop: 10 }}
                    >
                      <Text
                        testID="textCUILLabelDetail"
                        accessibilityLabel="textCUILLabelDetail"
                        style={styles.cardText}
                      >
                        CUIL: &nbsp;
                        </Text>
                      <Text
                        testID="textCUILValueDetail"
                        accessibilityLabel="textCUILValueDetail"
                        style={styles.cuilText}
                      >
                        {procedure.cuil}
                      </Text>
                    </Text>
                    <Text
                      testID="textSourceDetail"
                      accessibilityLabel="textSourceDetail"
                      style={{ paddingTop: 10 }}
                    >
                      <Text
                        testID="textSourceLabelDetail"
                        accessibilityLabel="textSourceLabelDetail"
                        style={styles.cardText}
                      >
                        Origen: &nbsp;
                        </Text>
                      <Text
                        testID="textSourceValueDetail"
                        accessibilityLabel="textSourceValueDetail"
                        style={styles.cuilText}
                      >
                        {procedure.source ? procedure.source.description : ""}
                      </Text>
                    </Text>
                    <Text
                      testID="textCommercialObservationLabel"
                      accessibilityLabel="textCommercialObservationLabel"
                      style={{ paddingTop: 10 }}
                    >
                      <Text style={styles.cardText}>Observaciones:</Text>
                    </Text>
                    <Text
                      testID="textCommercialObservationValue"
                      accessibilityLabel="textCommercialObservationValue"
                      style={{ paddingTop: 10 }}
                    >
                      <Text style={styles.obsText}>
                        {procedure.commercialValidation.observation}
                      </Text>
                    </Text>
                    <Text
                      testID="textFilesLabel"
                      accessibilityLabel="textFilesLabel"
                      style={{ paddingTop: 10 }}
                    >
                      <Text style={styles.cardText}>Archivos:</Text>
                    </Text>
                    {procedure.forms.map((item, index) => {
                      return (
                        <View key={index} style={{ flex: 1, flexDirection: 'row' }}>
                          <TouchableOpacity
                            onPress={() => shareFile(item)}
                            style={{
                              flexGrow: 1,
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignSelf: "stretch",
                              paddingRight: 8,
                              paddingVertical: 4,
                            }}
                            testID={"btnShare"}
                            accessibilityLabel={"btnShare"}
                        >
                          <Text
                            testID={`textFileName${index}`}
                              accessibilityLabel={`textFileName${index}`}
                              style={{ paddingTop: 10, maxWidth: Dimensions.get('screen').width - 100 }}
                          >
                              <Text style={styles.obsText}>
                                {item.description.substring(
                                item.description.lastIndexOf("/") + 1
                              )}
                            </Text>
                          </Text>
                          <AntDesign
                              name="sharealt"
                              size={24}
                              color="black"
                              style={{ paddingTop: 3 }}
                            />
                          </TouchableOpacity>
                          {Platform.OS === 'android' &&
                            <TouchableOpacity
                            onPress={() => downloadFile(item)}
                              testID={"btnDownload"}
                            accessibilityLabel={"btnDownload"}
                            style={{
                              paddingVertical: 4,
                            }}
                            >
                              <AntDesign
                              name="download"
                              size={24}
                              color="black"
                              style={{ paddingTop: 3 }}
                            />
                          </TouchableOpacity>
                          }
                        </View>
                      );
                    })}
                  </Body>
                </CardItem>
                {imageUrl && imageUrl.map((url, index) => {
                  return (

                    <CardItem
                      testID={`cardBody${index}`}
                      accessibilityLabel={`cardBody${index}`}
                      key={url}
                      style={[styles.cardItemContainer, styles.cardBody]}
                      cardBody
                    >
                      {fileLoading[index] &&
                        <View style={styles.spinnerContainer}>
                          <Spinner
                            testID="spinner"
                            accessibilityLabel="spinner"
                            color="#f16921"
                            size="large"
                          />
                        </View>
                      }
                      <Body>
                        <View style={styles.fileContainer}>
                          <ImageBackground
                            source={{ uri: url }}
                            style={styles.fileContent}
                            onLoadStart={() => setFileLoading({ ...fileLoading, [index]: true })}
                            defaultSource={require("../../../assets/image_not_available.jpg")}
                            onLoadEnd={() => setFileLoading({ ...fileLoading, [index]: false })}
                          >
                            <TouchableOpacity
                              onPress={() => handleFullScreen(url)}
                              style={styles.btnFullScreenContent}
                              testID={`fileCard${index}`}
                              accessibilityLabel={`fileCard${index}`}
                            >
                              <MaterialIcons
                                testID={`btnFullScreen${index}`}
                                accessibilityLabel={`btnFullScreen${index}`}
                                name="fullscreen"
                                size={32}
                                color="white"
                              />
                              <Text
                                testID={`textFullScreen${index}`}
                                accessibilityLabel={`textFullScreen${index}`}
                                style={styles.obsText}
                              >
                                {fileLoading[index] ? 'Cargando...' : 'Ver documentación'}
                              </Text>
                            </TouchableOpacity>
                          </ImageBackground>
                        </View>
                      </Body>
                    </CardItem>
                  );
                })}
                {fileUrl && fileUrl.map((url, index) => {
                return (
                    <CardItem
                        testID={`cardBody${index}`}
                        accessibilityLabel={`cardBody${index}`}
                        key={url}
                        style={[styles.cardItemContainer, styles.cardBody]}
                        cardBody
                    > 
                        {fileLoading[index] &&
                            <View style={styles.spinnerContainer}>
                                <Spinner
                                    testID="spinner"
                                    accessibilityLabel="spinner"
                                    color="#f16921"
                                    size="large"
                                />
                            </View>
                        }
                        <Body>
                            <View style={styles.fileContainer}>     
                                <ImageBackground
                                source={require("../../../assets/display/pdf.png")}
                                style={styles.fileContent}
                                onLoadStart={() => setFileLoading({ ...fileLoading, [index]: true })}
                                defaultSource={require("../../../assets/display/pdf.png")}
                                onLoadEnd={() => setFileLoading({ ...fileLoading, [index]: false })}
                                >
                                <TouchableOpacity
                                    onPress={() => handleFullScreenPdf(url)}
                                    style={styles.btnFullScreenContent}
                                    testID={`fileCard${index}`}
                                    accessibilityLabel={`fileCard${index}`}
                                >
                                    <MaterialIcons
                                    testID={`btnFullScreen${index}`}
                                    accessibilityLabel={`btnFullScreen${index}`}
                                    name="fullscreen"
                                    size={32}
                                    color="black"
                                    /> 
                                </TouchableOpacity>
                                </ImageBackground>
                            </View>
                        </Body>
                    </CardItem>
                )})}
                <View opacity={1} style={styles.btnNotifContainer}>
                  <TouchableOpacity
                    onPress={() => handleSeeNotification(procedure)}
                    style={[styles.btnNotifContent, genericStyles.btnShadow]}
                  >
                    <Text
                      style={styles.btnNotifText}
                      testID={"btnNotification"}
                      accessibilityLabel={"btnNotification"}
                    >
                      Ver notificaciones
                      </Text>
                  </TouchableOpacity>
                </View>
              </Card>
            )}
          </Grid>
          <InfoModal
            isVisible={existError}
            message={messageError}
            handleAccept={handleErrorModal}
          />
          <InfoModal
            isVisible={fileConfirmation}
            message={messageErrorFile}
            handleAccept={() => setFileConfirmation(false)}
          />
        </Grid>
      </Content>
    </Container>
  );
}
