import { companyApiCall } from '..';
import{ GET_METHOD } from '../../../consts/index';
import { handleErrorResponse, buildQueryParams, checkInternetConnection } from '../../../utils';

export const requestUserDomain = async(payload) =>  {
    try {
        await checkInternetConnection();
        const options = {
                method: GET_METHOD,
                endpoint: '/networks',
                params: buildQueryParams(payload, null, null)
            };
            let response = await companyApiCall(options);
            return response.data;
        } catch (error) {
            const messageError = handleErrorResponse(error);
            throw new Error(messageError);
        }
}

export const requestValidDomain = async (payload) => {
    try {
        await checkInternetConnection();
        const options = {
            method: GET_METHOD,
            endpoint: '/domains',
            params: buildQueryParams(payload, null, null)
        };
        let response = await companyApiCall(options);
        return response.data;
    } catch (error) {
        const messageError = handleErrorResponse(error);
        throw new Error(messageError);
    }
}