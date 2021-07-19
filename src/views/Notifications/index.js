import React, { useCallback, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl, FlatList, Dimensions } from "react-native";
import { Container, Content, Header, View, Button, Left, Right, Text, CardItem, Body, Icon, Spinner } from "native-base";
import { AntDesign } from "@expo/vector-icons";

import styles from './style';

import InfoModal from "../../components/Modals/InfoModal";
import { PROCEDURE, PROCEDURE_APPROVED_BY_ABM_MESSAGE, PROCEDURE_APPROVED_BY_COMMERCIAL_MESSAGE, 
    PROCEDURE_RETURNED_BY_ABM_MESSAGE, PROCEDURE_REJECTED_BY_COMMERCIAL_MESSAGE
} from '../../consts';
import { format, DATE_FORMAT_YYYY_MMMM_DD_HH_MM } from '../../utils/dateUtils';
import { getNotifications } from "../../redux/api/notifications";
import { checkInternetConnection } from "../../utils";

export default function Notifications({navigation, route}) {

    const { notifications, params } = route.params;

    const [notificationsList, setNotificationsList] = useState(notifications);
    const [dataPagination, setDataPagination] = useState({ page: 1, size: 10, total: 0 });

    const [messageError, setMessageError] = useState('');
    const [existError, setExistError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [end, setEnd] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    useFocusEffect(
        useCallback(() => {
            cleanUp();
            async function fetchingData() {
                await fetchData();
            }
            fetchingData();
        }, [])
    );

    const fetchData = async () => {
        try {
            setEnd(false)
            if (!isFetching) {
                setIsFetching(true);
                const response = await getNotifications(params, 1, 10);
                setNotificationsList(response.data);
                setDataPagination(response.metadata);
            }
        } catch (error) {
            setExistError(true);
            setMessageError(error ? error.message : error);
        } finally {
            setIsFetching(false);
        }
    }

    const cleanUp = () => {
        setExistError(false);
        setMessageError("");
        setEnd(false);
        setNotificationsList([]);
        setDataPagination({ page: 1, size: 10, total: 0 });
    };

    const handleGoBack = () => {
        navigation.goBack();
    };
    
    const handleSeeProcedure = async (notification) => {
        try {
            await checkInternetConnection();
            if (!notification || !notification.idProcedure) return;
            navigation.navigate(PROCEDURE, { id: notification.idProcedure });
        } catch (error) {
            setExistError(true);
            setMessageError(error.message);
        }
    };

    const formattedDate = (notification) => {
        if (!notification) return '';
        return format(notification.date, DATE_FORMAT_YYYY_MMMM_DD_HH_MM);
    };

    const getNotificationStyle = (notification) => {
        if (!notification || !notification.description) return {};

        if (notification.description.includes(PROCEDURE_APPROVED_BY_COMMERCIAL_MESSAGE) 
            || notification.description.includes(PROCEDURE_APPROVED_BY_ABM_MESSAGE)) {
            return {backgroundColor: '#68d34d6e'}
        }
        if (notification.description.includes(PROCEDURE_REJECTED_BY_COMMERCIAL_MESSAGE) 
            || notification.description.includes(PROCEDURE_RETURNED_BY_ABM_MESSAGE)) {
            return {backgroundColor: '#f2588347'};
        }

        return {};
    };


    const handleMoreData = async () => {
        if (!loading && (Math.ceil(dataPagination.total / dataPagination.size) > dataPagination.page)) {
            try {
                setLoading(true);
                const newPage = parseInt(dataPagination.page, 10) + 1;
                const response = await getNotifications(params, newPage, dataPagination.size);
                setNotificationsList(list => list.concat(response.data));
                setDataPagination(response.metadata);
            } catch (error) {
                setExistError(true);
                setMessageError(error ? error.message : error);
            } finally {
                setLoading(false);
            }
        } else {
            if (!loading && dataPagination.total > 10 && (Math.ceil(dataPagination.total / dataPagination.size) == dataPagination.page)) {
                setEnd(true)
            }
        }
    };

    const handleErrorModal = () => {
        setExistError(false);
        setMessageError('');
        navigation.goBack();
    };

    const renderFooter = () => {
        return (
            !loading ? end &&
                <View><Text style={{ textAlign: 'center' }} id="lblNoMoreNotifications">No hay más notificaciones para cargar</Text></View>
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

    const renderItems = ({ item, index }) => {
        return (
            <CardItem testID={`card${index}`} accessibilityLabel={`card${index}`} key={index}
                style={[styles.filterCardContainer, getNotificationStyle(item)]}
            >
                <Content>
                    <View style={{ width: '95%' }}>
                        <Text testID={`textDescription${index}`} accessibilityLabel={`textDescription${index}`}
                            style={styles.filterCardText}
                        >
                            {item.description}
                        </Text>
                        <Text testID={`textDate${index}`} accessibilityLabel={`textDate${index}`}
                            style={styles.filterCardDate}
                        >
                            <AntDesign name="clockcircleo" size={12} color="#575b5769" />
                                            &nbsp; {formattedDate(item)}
                        </Text>
                    </View>
                </Content>
                <Right style={styles.filterArrow}>
                    <Icon testID={`btnSeeProcedure${index}`} accessibilityLabel={`btnSeeProcedure${index}`}
                        name="arrow-forward" onPress={() => handleSeeProcedure(item)}
                        style={{ color: 'black' }} />
                </Right>
            </CardItem>
        )
    }

    return (
        <Container>
            <View>
                <Header style={styles.header} androidStatusBarColor={"#e45205"}>
                    <Left style={{ flex: 0.2 }}>
                        <Button
                            transparent onPress={() => handleGoBack()}
                        >
                            <Icon testID='btnGoBack' accessibilityLabel='btnGoBack'
                                style={styles.icon} name='arrow-back' size={24} />
                        </Button>
                    </Left>
                    <Body style={{ flex: 0.6, alignItems: "center" }}>
                        <Text testID='textTitle' accessibilityLabel='textTitle'
                            style={styles.headerTitle}
                        >
                            Notificaciones
                        </Text>
                    </Body>
                    <Right style={{ flex: 0.2 }}></Right>
                </Header>
            </View>
            <FlatList
                data={notificationsList}
                renderItem={renderItems}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={renderFooter}
                onEndReached={handleMoreData}
                onEndReachedThreshold={0.5}
                refreshing={loading}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={fetchData}
                        colors={['#f16921']}
                        tintColor={'#f16921'}
                    />
                }
            />
            <InfoModal isVisible={existError} message={messageError} 
                handleAccept={handleErrorModal} />
        </Container>
    );
}
