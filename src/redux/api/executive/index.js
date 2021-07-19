import { executiveApiCall } from '..';
import{ POST_METHOD, PUT_METHOD,GET_METHOD } from '../../../consts/index';
import { handleErrorResponse, buildQueryParams, checkInternetConnection } from '../../../utils';

export const validatePasswordCode = async(payload) => {
    try {
        await checkInternetConnection();
        const options = {
            method: POST_METHOD,
            endpoint: '/auth/validate',
            data: payload
        };
        await executiveApiCall(options);
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}

export const generatePasswordCode = async(payload) => {
    try {
        await checkInternetConnection();
            const options = {
                method: POST_METHOD,
                endpoint: '/auth/code',
                data: payload
            };
            await executiveApiCall(options);
        } catch (error) {
            const messageError = handleErrorResponse(error);
            throw new Error(messageError);
        }
}

export const changePassword = async(payload) => {
    try {
        await checkInternetConnection();
        const options = {
            method: POST_METHOD,
            endpoint: '/auth/changePassword',
            data: payload
        };
        await executiveApiCall(options);
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}

export const getExecutive = async(payload) =>  {
    try {
        await checkInternetConnection();
        const options = {
            method: GET_METHOD,
            endpoint: '',
            params: buildQueryParams(payload, null, null)
            };
        let response = await executiveApiCall(options);
        return response.data;
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}

export const updateExecutive = async(payload) => {
    try {
        await checkInternetConnection();
        const options = {
            method: PUT_METHOD,
            endpoint: `/${payload.id}`,
            data: payload
        };
        await executiveApiCall(options);
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}

export const createExecutive = async(payload) => {
    try {
        await checkInternetConnection();
        const options = {
            method: POST_METHOD,
            endpoint: '',
            data: payload
        };
        const response = await executiveApiCall(options);
        return response.data;
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}

export const getFrecuentQuestions = async () => {
    try {
        await checkInternetConnection();
        const options = {
            method: GET_METHOD,
            endpoint: `/frequently-asked-questions`,
        }
        const response = await executiveApiCall(options);
        return response ? response.data : response;
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}