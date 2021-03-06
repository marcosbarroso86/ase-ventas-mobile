import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View, Keyboard, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  Container,
  Body,
  Left,
  Right,
  Text,
  Card,
  CardItem,
  Spinner,
} from "native-base";
import { Entypo, AntDesign } from "@expo/vector-icons";
import styles from "./style";
import MenuBar from "../../components/MenuBar";
import InfoModal from "../../components/Modals/InfoModal";
import {
  USER_DATA,
  PROCEDURE,
  NOTIFICATIONS,
  UPLOAD_PROCEDURE,
} from "../../consts";
import { format, DATE_FORMAT_YYYY_MMMM_DD_HH_MM } from "../../utils/dateUtils";
import { buildDomain, checkInternetConnection, getItem, getStateColor, sleep } from "../../utils";
import { getNotifications } from "../../redux/api/notifications";
import { getProcedures } from "../../redux/api/procedures";
import { FlatList } from "react-native-gesture-handler";
import { requestValidDomain } from "../../redux/api/company";

export default function Procedures({ navigation, route }) {
  const [messageError, setMessageError] = useState("");
  const [existError, setExistError] = useState(false);

  const [procedures, setProcedures] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [endReachedThreshold, setEndReachedThreshold] = useState(5)
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
  const [end, setEnd] = useState(false);
  const [isValidDomain, setIsValidDomain] = useState(true);

  useFocusEffect(
    useCallback(() => {
      cleanUp();
      async function fetchData() {
        await fetchProceduresData();
      }
      fetchData();
      validateExecutiveDomain()
    }, [])
  );

  useEffect(() => {
    navigation.addListener('blur', () => {
      setIsFetching(false);
      setProcedures([])
    });
  }, [navigation]);

  const validateExecutiveDomain = async () => {
    const user = JSON.parse(await getItem(USER_DATA));
    const description = buildDomain(user.email);
    const userDomain = await requestValidDomain({ description });
    setIsValidDomain(userDomain.length > 0);
  }

  const cleanUp = () => {
    setExistError(false);
    setMessageError("");
    setEnd(false);
    setProcedures([]);
    setPagination({ page: 1, size: 10, total: 0 });
  };

  const handleSeeNotification = async (procedure) => {
    if (!procedure) return;
    try {
      setLoading(true);
      const params = { procedure: procedure.id };
      const orders = "id:desc";
      const response = await getNotifications(params, null, null, orders);
      navigation.navigate(NOTIFICATIONS, {
        notifications: response.data,
        pagination: response.metadata,
        params,
      });
    } catch (error) {
      setExistError(true);
      setMessageError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonDetail = async (procedure) => {
    try {
      await checkInternetConnection();
      navigation.navigate(PROCEDURE, { id: procedure.id });
    } catch (error) {
      setExistError(true);
      setMessageError(error.message);
    }
  };

  const handleGoBack = () => {
    cleanUp();
    navigation.navigate(UPLOAD_PROCEDURE);
  };

  const handleMoreData = async () => {
    if (!loading && (Math.ceil(pagination.total / pagination.size) > pagination.page)) {
      try {
        setEndReachedThreshold(endReachedThreshold + 4);
        setLoading(true);
        const user = JSON.parse(await getItem(USER_DATA));
        const params = { executive: { eq: user.id } };
        const newPage = parseInt(pagination.page, 10) + 1;
        const orders = "id:desc";
        const response = await getProcedures(
          params,
          newPage,
          pagination.size,
          orders
        );
        setProcedures(list => list.concat(response.data));
        setPagination(response.metadata);
      } catch (error) {
        setExistError(true);
        setMessageError(error ? error.message : error);
      } finally {
        setLoading(false);
      }
    }
    else {
      if (!loading && pagination.total > 3 && (Math.ceil(pagination.total / pagination.size) == pagination.page)) {
        setEnd(true)
      }
    }
  };

  const handleErrorModal = () => {
    handleGoBack();
  };

  const fetchProceduresData = async () => {
    try {
      setEnd(false)
      if (!isFetching) {
        setIsFetching(true);
        const user = JSON.parse(await getItem(USER_DATA));
        const params = { executive: { eq: user.id } };
        const newPage = parseInt(1, 10);
        const orders = 'id:desc'
        const response = await getProcedures(
          params,
          newPage,
          pagination.size,
          orders
        );
        setProcedures(response.data);
        setPagination(response.metadata);
        if (!response.data.length) {
          setExistError(true);
          setMessageError("No hay gestiones cargadas");
        }
      }
    } catch (error) {
      setExistError(true);
      setMessageError(error ? error.message : error);
    } finally {
      setIsFetching(false);
    }
  };

  const formattedDate = (aDate) => {
    return format(aDate, DATE_FORMAT_YYYY_MMMM_DD_HH_MM);
  };

  const getStateStyle = (state) => {
    return state ? getStateColor(state.id) : {};
  };

  const renderItems = ({ item, index }) => {
    return (
      <Card key={item.id} style={styles.cardContainer}>
        <CardItem
          testID={`cardBody${index}`}
          accessibilityLabel={`cardBody${index}`}
          key={`cardBody${index}`}
          style={styles.cardBodyContainer}
          cardBody
        >
          <Body>
            <Text
              testID={`textProcedure${index}`}
              accessibilityLabel={`textProcedure${index}`}
              style={[styles.cardText, styles.cardTitleText]}
            >
              Gesti??n: #{item.id} {item.prospect ? ` - Prospect: #${item.prospect.id}` : null}
            </Text>

            <Text
              testID={`textDate${index}`}
              accessibilityLabel={`textDate${index}`}
              style={styles.cardDate}
            >
              <AntDesign
                name="clockcircleo"
                size={12}
                color="#b1bbb1"
              />
                            &nbsp; Gesti??n iniciada{" "}
              {formattedDate(item.creationDate)}
            </Text>

            <Text
              testID={`textState${index}`}
              accessibilityLabel={`textState${index}`}
              style={{ paddingTop: 10 }}
            >
              <Text
                testID={`textStateLabel${index}`}
                accessibilityLabel={`textStateLabel${index}`}
                style={styles.cardText}
              >
                Estado actual: &nbsp;
                            </Text>
              <Text
                testID="textStateValue"
                accessibilityLabel="textSateValue"
                style={[
                  getStateStyle(item.state),
                  styles.stateText,
                ]}
              >
                {item.state.name}
              </Text>
            </Text>

            <Text
              testID={`textCUIT${index}`}
              accessibilityLabel={`textCUIT${index}`}
              style={{ paddingTop: 10 }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              <Text
                testID={`textCUITLabel${index}`}
                accessibilityLabel={`textCUITLabel${index}`}
                style={styles.cardText}
              >
                CUIT (empresa): &nbsp;
                            </Text>
              <Text
                testID={`textCUITValue${index}`}
                accessibilityLabel={`textCUITValue${index}`}
                style={styles.cuitText}
              >
                {item.cuit}
              </Text>
            </Text>

            <Text
              testID={`textCUIL${index}`}
              accessibilityLabel={`textCUIL${index}`}
              style={{ paddingTop: 10 }}
            >
              <Text
                testID={`textCUILLabel${index}`}
                accessibilityLabel={`textCUILLabel${index}`}
                style={styles.cardText}
              >
                CUIL: &nbsp;
                            </Text>
              <Text
                testID={`textCUILValue${index}`}
                accessibilityLabel={`textCUILValue${index}`}
                style={styles.cuilText}
              >
                {item.cuil}
              </Text>
            </Text>
            <Text
              testID={`textSource${index}`}
              accessibilityLabel={`textSource${index}`}
              style={{ paddingTop: 10 }}
            >
              <Text
                testID={`textSourceLabel${index}`}
                accessibilityLabel={`textSourceLabel${index}`}
                style={styles.cardText}
              >
                Origen: &nbsp;
                            </Text>
              <Text
                testID={`textSourceValue${index}`}
                accessibilityLabel={`textSourceValue${index}`}
                style={styles.cuilText}
              >
                {item.source ? item.source.description : ""}
              </Text>
            </Text>
          </Body>
        </CardItem>
        <CardItem
          testID={`cardFooter${index}`}
          accessibilityLabel={`cardFooter${index}`}
          key={`cardFooter${index}`}
          style={styles.cardFooterContainer}
          footer
          bordered
        >
          <Left style={{ paddingRight: 5 }}>
            <TouchableOpacity
              onPress={() => handleSeeNotification(item)}
              style={styles.btnFooter}
            >
              <Entypo
                testID={`btnChat${index}`}
                accessibilityLabel={`btnChat${index}`}
                name="chat"
                size={24}
                color="grey"
              />
              <Text
                testID={`btnViewNotifications${index}`}
                accessibilityLabel={`btnViewNotifications${index}`}
                style={styles.textBtn}
              >
                Ver notificaciones
              </Text>
            </TouchableOpacity>
          </Left>
          <Right style={{ paddingLeft: 5 }}>
            <TouchableOpacity
              onPress={() => handleButtonDetail(item)}
              disabled={!isValidDomain}
              style={[styles.btnFooter, !isValidDomain && { opacity: 0.37 }]}
            >
              <Entypo
                testID={`btnChevronRight${index}`}
                accessibilityLabel={`btnChevronRight${index}`}
                name="chevron-small-right"
                size={24}
                color="grey"
              />
                <Text
                  testID={`btnViewDetails${index}`}
                  accessibilityLabel={`btnViewDetails${index}`}
                  style={styles.textBtn}
                >
                  Descargar documentos
                </Text>
            </TouchableOpacity>
          </Right>
        </CardItem>
        </Card>
    )
  }

  const renderFooter = () => {
    return (
      !loading ? end &&
        <View><Text style={{ textAlign: 'center' }} id="lblNoMoreProcedures">No hay m??s gestiones para cargar</Text></View>
        :
      <View >
        <Spinner
          testID="spinner"
          accessibilityLabel="spinner"
          color="#f16921"
        />
      </View>
    )
  }

  return (
    <Container>
      <MenuBar
        onPress={() => {
          navigation.openDrawer();
          Keyboard.dismiss();
        }}
        title="Mis gestiones"
        navigation={navigation}
        rightVisible={false}
      />
      <FlatList
        data={procedures}
        renderItem={renderItems}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderFooter}
        onEndReached={handleMoreData}
        onEndReachedThreshold={0.5}
        refreshing={loading}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={fetchProceduresData}
            colors={['#f16921']}
            tintColor={'#f16921'}
          />
        }
      />
      <InfoModal
        isVisible={existError}
        message={messageError}
        handleAccept={handleErrorModal}
      />
    </Container>
  );
}
