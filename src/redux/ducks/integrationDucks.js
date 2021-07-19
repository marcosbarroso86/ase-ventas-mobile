import { companyApiCall } from '../api';
import { GET_METHOD, ACCESS_TOKEN } from '../../consts';
import { getItem, handleErrorResponse } from '../../utils';

const initialState = {
    networks : [],
    zones: [],
    error : '',
};

const GET_NETWORKS = "GET_NETWORKS";
const GET_ZONES = "GET_ZONES";
const GET_ZONES_ERROR = "GET_ZONES_ERROR";
const GET_NETWORKS_ERROR = "GET_NETWORKS_ERROR";
export const INTEGRATION_INITIAL_STATE = "INTEGRATION_INITIAL_STATE";

export default function integrationReducer(state = initialState, action = {}) {
    switch (action.type) {
        case GET_NETWORKS:
            return { ...state, networks: action.payload };
        case GET_ZONES:
            return { ...state, zones: action.payload };
        case GET_NETWORKS_ERROR:
            return { ...state, networks: [], error: action.payload };
        case GET_ZONES_ERROR:
            return { ...state, zones: [], error: action.payload };
        case INTEGRATION_INITIAL_STATE:
            return{ initialState } 
        default:
            return { ...state };
    }
}

export const fetchInitialState = () => {
    return {
        type: INTEGRATION_INITIAL_STATE
    }
}

export const setInitialStateIntegration = () =>{
    return (dispatch) => {
        dispatch(fetchInitialState());
    }
}

const getNetworks = (response) => {
    return {
        type: GET_NETWORKS,
        payload: response
    }
}


const getZones = (response) => {
    return {
        type: GET_ZONES,
        payload: response
    }
}

const getZonesError = (error) => {
    return {
        type: GET_ZONES_ERROR,
        payload: error
    }
}

const getNetworksError = (error) => {
    return {
        type: GET_NETWORKS_ERROR,
        payload: error
    }
}

export const networks = () => {
    return async (dispatch) => {
        try {
            const token = await getItem(ACCESS_TOKEN);
            const options = {
                method: GET_METHOD,
                endpoint: '/networks',
                headers: {'Authorization': `Bearer ${token}`}
            };
            const response = await companyApiCall(options);
            
            dispatch(getNetworks(response.data));
        } catch (error) {
            const messageError = handleErrorResponse(error);
            dispatch(getNetworksError(messageError));
        }
    }
}

export const zones = () => {
    return async (dispatch) => {
        try {
            const token = await getItem(ACCESS_TOKEN);
            const options = {
                method: GET_METHOD,
                endpoint: '/regions/zones',
                headers: { 'Authorization': `Bearer ${token}` }
            };
            const response = await companyApiCall(options);

            dispatch(getZones(response.data));
        } catch (error) {
            const messageError = handleErrorResponse(error);
            dispatch(getZonesError(messageError));
        }
    }
}
