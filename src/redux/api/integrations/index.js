import { companyApiCall } from "..";
import { ACCESS_TOKEN, GET_METHOD } from "../../../consts";
import { getItem, buildUrlParams, handleErrorResponse, checkInternetConnection } from "../../../utils";

export const getCompanies = async (params, page, size, orders) => {
    try {
        await checkInternetConnection();
        const token = await getItem(ACCESS_TOKEN);
        const options = {
            method: GET_METHOD,
            endpoint: `/companies${buildUrlParams(params, page, size, orders)}`,
            headers: { 'Authorization': `Bearer ${token}` }
        }
        const response = await companyApiCall(options);
        return response ? response.data : response;
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}

export const getLimit = async () => {
    try {
        await checkInternetConnection();
        const token = await getItem(ACCESS_TOKEN);
        const options = {
            method: GET_METHOD,
            endpoint: `/calculator/limits`,
            headers: { 'Authorization': `Bearer ${token}` }
        }
        const response = await companyApiCall(options);
        return response ? response.data : response;
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}
