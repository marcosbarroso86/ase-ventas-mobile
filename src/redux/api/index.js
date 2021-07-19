import axios from "axios";

import { buildRequest } from '../../utils';
import environment from '../../../environment';

const { EXECUTIVE_API_HOST, PROCEDURE_API_HOST, COMPANY_API_HOST, NOTIFICATION_API_HOST, EXECUTIVE_BASE_URL,
    PROCEDURE_BASE_URL, INTEGRATION_BASE_URL, NOTIFICATION_BASE_URL, USER_KEY, PROSPECT_BASE_URL } = environment();

export const executiveApiCall = (options) => {
    const completeURL = `${getExecutiveBaseUrl()}${buildEndpoint(options.endpoint)}`;
    const object = buildRequest(completeURL, options.method, options.data, options.params, options.headers);
    return axios(object);
}

export const procedureApiCall = async (options) => {
    const completeURL = `${getProcedureBaseUrl()}${buildEndpoint(options.endpoint)}`;
    const object = buildRequest(completeURL, options.method, options.data, options.params, options.headers);
    return await axios(object);
}

export const prospectApiCall = (options) => {
    const completeURL = `${getProspectBaseUrl()}${buildEndpoint(options.endpoint)}`;
    const object = buildRequest(completeURL, options.method, options.data, options.params, options.headers);
    return axios(object);
}

export const companyApiCall = (options) => {
    const completeURL = `${getIntegrationBaseUrl()}${buildEndpoint(options.endpoint)}`;
    const object = buildRequest(completeURL, options.method, options.data, options.params, options.headers);
    return axios(object);
}

export const notificationApiCall = (options) => {
    const completeURL = `${getNotificationBaseUrl()}${buildEndpoint(options.endpoint)}`;
    const object = buildRequest(completeURL, options.method, options.data, options.params, options.headers);
    return axios(object);
}

export const getExecutiveBaseUrl = () => {
    return `${EXECUTIVE_API_HOST}${EXECUTIVE_BASE_URL}`;
}

export const getProcedureBaseUrl = () => {
    return `${PROCEDURE_API_HOST}${PROCEDURE_BASE_URL}`;
}

export const getProspectBaseUrl = () => {
    return `${PROCEDURE_API_HOST}${PROSPECT_BASE_URL}`;
}

export const getNotificationBaseUrl = () => {
    return `${NOTIFICATION_API_HOST}${NOTIFICATION_BASE_URL}`;
}

export const getIntegrationBaseUrl = () => {
    return `${COMPANY_API_HOST}${INTEGRATION_BASE_URL}`;
}

// TODO Esta funcion debe estar en otro lugar (utils por ej) cuando se arma 
// el resto del endpoint para cada servicio.
export const buildEndpoint = (endpoint) => {
    if (!USER_KEY) {
        return endpoint;
    }

    const userKeyParam = endpoint.includes('?') ? `&user_key=${USER_KEY}` : `?user_key=${USER_KEY}`
    return endpoint.concat(userKeyParam);
}

