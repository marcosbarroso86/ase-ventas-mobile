import React, { useCallback, useState } from "react";
import MenuBar from "../../components/MenuBar";
import { TouchableOpacity, View, Keyboard, RefreshControl } from "react-native";
import {
    Container,
    Body,
    Left,
  Text,
  Card,
  CardItem,
  Spinner,
} from "native-base";
import styles from "./style";
import { useFocusEffect } from "@react-navigation/native";
import { getProspects } from "../../redux/api/prospects";
import InfoModal from "../../components/Modals/InfoModal";
import { getItem, saveItem } from "../../utils";
import { USER_DATA, UPLOAD_PROSPECT, UPLOAD_PROCEDURE } from "../../consts";
import { AntDesign } from "@expo/vector-icons";
import { format, DATE_FORMAT_YYYY_MMMM_DD_HH_MM } from "../../utils/dateUtils";
import { FlatList } from "react-native-gesture-handler";

export default function Prospects({ navigation, route }) {
    const [loading, setLoading] = useState(false);
    const [prospects, setProspects] = useState([]);
    const [existError, setExistError] = useState(false);
    const [messageError, setMessageError] = useState("");
    const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
    const [isFetching, setIsFetching] = useState(false);
    const [end, setEnd] = useState(false);

    useFocusEffect(
        useCallback(() => {
            cleanUp();
            async function fetchData() {
                await fetchProspectData();
            }
            fetchData();
        }, [])
    );

    const formattedDate = (aDate) => {
        return format(aDate, DATE_FORMAT_YYYY_MMMM_DD_HH_MM);
    };

    const fetchProspectData = async () => {
        try {
            setEnd(false);
            if(!isFetching) {
                setIsFetching(true);
                const user = JSON.parse(await getItem(USER_DATA));
                const params = { executive: { eq: user.id } };
                const newPage = parseInt(1, 10);
                const orders = "id:desc";
                const response = await getProspects(
                    params,
                    newPage,
                    pagination.size,
                    orders
                );
                setProspects(response.data);
                setPagination(response.metadata);
                if (!response.data.length) {
                    setExistError(true);
                    setMessageError("No hay prospects cargados");
                }
            }
        }   catch (error) {
            setExistError(true);
            setMessageError(error ? error.message : error);
        }   finally {
            setIsFetching(false);
        }
    };

    const handleMoreData = async () => {
        if (!loading && (Math.ceil(pagination.total / pagination.size) > pagination.page)) {
            try {
                setLoading(true);
                const user = JSON.parse(await getItem(USER_DATA));
                const params = { executive: { eq: user.id } };
                const newPage = parseInt(pagination.page, 10) + 1;
                const orders = "id:desc";
                const response = await getProspects(
                    params,
                    newPage,
                    pagination.size,
                    orders
                );
                setProspects(list => list.concat(response.data));
                setPagination(response.metadata);
            } catch (error) {
                setExistError(true);
                setMessageError(error ? error.message : error);
            } finally {
                setLoading(false);
            }
        }
        else {
            if (!loading && pagination.total > 4 && (Math.ceil(pagination.total / pagination.size) == pagination.page)) {
                setEnd(true)
            }
        }
    };

    const cleanUp = () => {
        setExistError(false);
        setMessageError("");
        setEnd(false);
        setProspects([]);
        setPagination({ page: 1, size: 10, total: 0 });
    };

    const handleGoBack = () => {
        navigation.navigate("ConsultProspectStack", {
            screen: UPLOAD_PROSPECT,
        });
        cleanUp();
    };

    const handleErrorModal = () => {
        setExistError(false);
        handleGoBack();
    };

    const handleGoToManagement = async (item) => {
        await saveItem("PROSPECT", JSON.stringify(item));
        // paso el prospect seleccionado por storage por que no esta funcionando pasar por param a otro screen de un drawer
        navigation.navigate("Home", {
            screen: UPLOAD_PROCEDURE,
            params: { prospect: item },
        });
    };

    const showButton = (item) => {
        if (item.procedure) {
            return false;
        }
        if (item.state.id === 2) {
            return true;
        }
        return false;
    };

    const renderItems = ({ item, index}) => {
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
                            testID={`textProspect${index}`}
                            accessibilityLabel={`textProspect${index}`}
                            style={[styles.cardText, styles.cardTitleText]}
                        >
                            Prospect: #{item.id}
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
                            &nbsp; Prospect iniciado
                            {" " + formattedDate(item.creationDate)}
                        </Text>
                        <Text
                            testID={`textCUIT${index}`}
                            accessibilityLabel={`textCUIT${index}`}
                            style={{ paddingTop: 10 }}
                            numberOfLines={1}
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
                            testID={`textProcedure${index}`}
                            accessibilityLabel={`textProcedure${index}`}
                            style={{ paddingTop: 10 }}
                        >
                            <Text
                                testID={`textProcedureLabel${index}`}
                                accessibilityLabel={`textProcedureLabel${index}`}
                                style={styles.cardText}
                            >
                                Gestión: &nbsp;
                            </Text>
                            <Text
                                testID={`textProcedureValue${index}`}
                                accessibilityLabel={`textProcedureValue${index}`}
                                style={styles.cuilText}
                            >
                                {item.procedure
                                ? item.procedure
                                : "Sin gestión asociada"}
                            </Text>
                        </Text>
                        <Text
                            testID={`textObservation${index}`}
                            accessibilityLabel={`textObservation${index}`}
                            style={{ paddingTop: 10 }}
                        >
                            <Text
                                testID={`textObservationLabel${index}`}
                                accessibilityLabel={`textObservationLabel${index}`}
                                style={styles.cardText}
                            >
                                Observación: &nbsp;
                            </Text>
                            <Text
                                testID={`textObservationValue${index}`}
                                accessibilityLabel={`textObservationValue${index}`}
                                style={styles.cuilText}
                            >
                                {item.observation}
                            </Text>
                        </Text>
                    </Body>
                </CardItem>
                {showButton(item) && (
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
                                onPress={() => handleGoToManagement(item)}
                                style={styles.btnFooter}
                            >
                                <AntDesign
                                    name="arrowright"
                                    size={24}
                                    color="#F3681F"
                                />
                                <Text
                                    testID={`btnAdvanceProcedure${index}`}
                                    accessibilityLabel={`btnAdvanceProcedure${index}`}
                                    style={styles.textBtn}
                                >
                                Avanzar gestión
                                </Text>
                            </TouchableOpacity>
                        </Left>
                    </CardItem>
                )}
            </Card>  
        )
    }
    const renderFooter = () => {
        return (
            !loading ? end &&
                <View><Text style={{ textAlign: 'center' }} id="lblNoMoreProspects">No hay más prospects para cargar</Text></View>
                :
                <View>
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
                title="Mis prospects"
                navigation={navigation}
                rightVisible={false}
            />
            <FlatList
                data={prospects}
                renderItem={renderItems}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={renderFooter}
                onEndReached={handleMoreData}
                onEndReachedThreshold={0.5}
                refreshing={loading}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={fetchProspectData}
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
