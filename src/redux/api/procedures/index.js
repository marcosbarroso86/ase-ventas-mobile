import { procedureApiCall } from "..";
import { ACCESS_TOKEN, GET_METHOD, POST_METHOD } from "../../../consts";
import { buildUrlParams, getItem, handleErrorResponse,checkInternetConnection, buildBody } from "../../../utils";

export const getProcedures = async (params, page, size, orders) => {
    try {
        await checkInternetConnection();
        const token = await getItem(ACCESS_TOKEN);
        const options = {
            method: GET_METHOD,
            endpoint: buildUrlParams(params, page, size, orders),
            headers: { 'Authorization': `Bearer ${token}` }
        }
        const response = await procedureApiCall(options);
        return response ? response.data : response;
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}

export const requestProcedure = async(payload) => {
    try {
            await checkInternetConnection();
            const token = await getItem(ACCESS_TOKEN);
            const options = {
            method: POST_METHOD,
            endpoint: '',
            data: buildBody(payload),
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        };
    const response = await procedureApiCall(options);
    return response.data.payload;
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}

export const requestSendForm = async(payload) => {
    try {
            await checkInternetConnection();
            const token = await getItem(ACCESS_TOKEN);
            const options = {
                method: POST_METHOD,
                endpoint: '/forms',
                data: payload,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await procedureApiCall(options);
        return response.data;
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}

export const getProcedure = async (params) => {
    try {
        await checkInternetConnection();
        const token = await getItem(ACCESS_TOKEN);
        const options = {
            method: GET_METHOD,
            endpoint: `/${params.id}`,
            headers: { 'Authorization': `Bearer ${token}` }
        }
        const response = await procedureApiCall(options);
        return response ? response.data : response;
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}