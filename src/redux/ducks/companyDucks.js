import { companyApiCall } from '../api' ;
import { GET_METHOD, ACCESS_TOKEN } from '../../consts';
import { buildQueryParams, handleErrorResponse, getItem, checkInternetConnection } from '../../utils';

const initialState = {
    data: [],
    error: '',
    success: false,
    loadingProcedure: false
};

export const REQUEST_COMPANY_STARTING = 'REQUEST_COMPANY_STARTING';
export const REQUEST_COMPANY_SUCCESS = "REQUEST_COMPANY_SUCCESS";
export const REQUEST_COMPANY_ERROR = "REQUEST_COMPANY_ERROR";
export const CLEAR_CUIT_ARRAY = 'CLEAR_CUIT_ARRAY';
export const REQUEST_USER_DOMAIN_ERROR = "REQUEST_USER_DOMAIN_ERROR";
export const REQUEST_USER_DOMAIN_SUCCESS = "REQUEST_USER_DOMAIN_SUCCESS";
export const COMPANY_INITIAL_STATE = "COMPANY_INITIAL_STATE";

export default function companyReducer(state = initialState, action = {}) {
    switch (action.type) {
        case REQUEST_COMPANY_STARTING:
            return { ...state, data:[], error: '', success: false, loadingProcedure: true };
        case REQUEST_COMPANY_SUCCESS:
            return { ...state, data: action.payload, loadingProcedure: false };
        case REQUEST_COMPANY_ERROR:
            return { ...state, error: action.payload, loadingProcedure: false };
        case CLEAR_CUIT_ARRAY:
            return { ...state, data:[], loadingProcedure: false, success: false };
        case REQUEST_USER_DOMAIN_ERROR:
            return { ...state, error: action.payload, loadingProcedure: false };
        case REQUEST_USER_DOMAIN_SUCCESS:
            return { ...state, data: action.payload, loadingProcedure: false, success: true };
        case COMPANY_INITIAL_STATE:
            return{ initialState } 
        default:
            return { ...state };
    }
}

export const fetchRequestCompanyError = (data) => {
    return {
        type: REQUEST_COMPANY_ERROR,
        payload: data
    }
}

export const fetchRequestStarting = () => {
    return {
        type: REQUEST_COMPANY_STARTING
    }
}

export const fetchClearCuitArray = () => {
    return {
        type: CLEAR_CUIT_ARRAY
    }
}

export const fetchRequestCompany = (response) => {
    return {
        type: REQUEST_COMPANY_SUCCESS,
        payload: response
    }
}

export const clearCuitArray = () =>  {
    return (dispatch) => {
        dispatch(fetchClearCuitArray());
    }
}

export const fetchRequestUserDomainError = (error) => {
    return {
        type: REQUEST_USER_DOMAIN_ERROR,
        payload: error
    }
}

export const fetchRequestUserDomainSuccess = (response) => {
    return {
        type: REQUEST_USER_DOMAIN_SUCCESS,
        payload: response
    }
}


export const fetchInitialState = () => {
    return {
        type: COMPANY_INITIAL_STATE
    }
}

export const setInitialStateCompany = () =>{
    return (dispatch) => {
        dispatch(fetchInitialState());
    }
}

export const requestCompany = (payload) =>  {
    return async (dispatch) => {
        try {
            await checkInternetConnection();
            dispatch(fetchRequestStarting());
            const token = await getItem(ACCESS_TOKEN);
            const options = {
                method: GET_METHOD,
                endpoint: '/companies',
                params: buildQueryParams({text: payload}, 1, 8),
                headers: {'Authorization': `Bearer ${token}`}
            };
            const response = await companyApiCall(options);
            dispatch(fetchRequestCompany(response.data));
        } catch (error) {
            const messageError = handleErrorResponse(error);
            dispatch(fetchRequestCompanyError(messageError));
        }
    }
}

export const requestCompanyFromProspect = async (payload) => {
    try {

        const token = await getItem(ACCESS_TOKEN);
        const options = {
            method: GET_METHOD,
            endpoint: '/companies',
            params: buildQueryParams({ text: payload }, 1, 8),
            headers: { 'Authorization': `Bearer ${token}` }
        };
        const response = await companyApiCall(options);
        return response.data[0]
    } catch (error) {
        const messageError = handleErrorResponse(error);
        dispatch(fetchRequestCompanyError(messageError));
    }
}

export const requestUserDomain = (payload) =>  {
    return async (dispatch) => {
        try {
            dispatch(fetchRequestStarting());

            const token = await getItem(ACCESS_TOKEN);
            const options = {
                method: GET_METHOD,
                endpoint: '/networks',
                params: buildQueryParams(payload, null, null),
                headers: {'Authorization': `Bearer ${token}`}
            };
            const response = await companyApiCall(options);

            dispatch(fetchRequestUserDomainSuccess(response.data));
        } catch (error) {
            const messageError = handleErrorResponse(error);
            dispatch(fetchRequestUserDomainError(messageError));
        }
    }
}
