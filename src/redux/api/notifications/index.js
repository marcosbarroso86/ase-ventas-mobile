import { notificationApiCall } from "..";
import { ACCESS_TOKEN, GET_METHOD } from "../../../consts";
import { buildUrlParams, checkInternetConnection, getItem, handleErrorResponse } from "../../../utils";

export const getNotifications = async (params, page, size, orders) => {
    try {
        await checkInternetConnection();
        const token = await getItem(ACCESS_TOKEN);
        const options = {
            method: GET_METHOD,
            endpoint: buildUrlParams(params, page, size, orders),
            headers: { 'Authorization': `Bearer ${token}` }
        }
        const response = await notificationApiCall(options);
        return response ? response.data : response;
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}

export const getNotification = async (params) => {
    try {
        await checkInternetConnection();
        const token = await getItem(ACCESS_TOKEN);
        const options = {
            method: GET_METHOD,
            endpoint: `/${params.id}`,
            headers: { 'Authorization': `Bearer ${token}` }
        }
        const response = await notificationApiCall(options);
        return response ? response.data : response;
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}