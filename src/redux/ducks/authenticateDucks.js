import jwt from 'jwt-decode';

import { executiveApiCall } from '../api';
import { POST_METHOD, USER_DATA, ACCESS_TOKEN } from '../../consts';
import { eraseItem, saveItem, handleErrorResponse, checkInternetConnection } from '../../utils';

const initialState = {
    data : {},
    error : '',
    loged: false,
    loading: false
};

export const GET_LOGIN_START = "GET_LOGIN_START";
export const GET_LOGIN_SUCCESS = "GET_LOGIN_SUCCESS";
export const GET_LOGIN_ERROR = "GET_LOGIN_ERROR";
export const GET_LOGOUT_START = "GET_LOGOUT_START";
export const GET_LOGOUT_SUCCESS = "GET_LOGOUT_SUCCESS";
export const GET_LOGOUT_ERROR = "GET_LOGOUT_ERROR";
export const INITIAL_STATE_AUTHENTICATE = "INITIAL_STATE_AUTHENTICATE";
export const NOT_ACCEPTED_TERMS = "NOT_ACCEPTED_TERMS";
export const CLEAR_NOT_ACCEPTED_TERMS = "CLEAR_NOT_ACCEPTED_TERMS";
export const GET_LOGED_SUCCESS = "GET_LOGED_SUCCESS";
export const GET_LOGED_ERROR = "GET_LOGED_ERROR";

export default function authenticateReducer(state = initialState, action = {}) {
    switch (action.type) {
        case GET_LOGIN_START:
            return { ...state, data: null, loged: false, loading: true, error: '' };
        case GET_LOGIN_SUCCESS:
            return { ...state, data: action.payload, loged: true, loading: false };
        case GET_LOGIN_ERROR:
            return { ...state, error: action.payload, loading: false, loged: false };
        case GET_LOGOUT_START:
            return { ...state, data: null, loged: true, loading: true, error: '' };
        case GET_LOGOUT_SUCCESS:
            return { ...state, data: action.payload, loged: false, loading: false, error: '' };
        case GET_LOGOUT_ERROR:
            return { ...state, error: action.payload, loading: false, loged: true };
        case INITIAL_STATE_AUTHENTICATE:
            return{ initialState }
        case CLEAR_NOT_ACCEPTED_TERMS:
            return{ ...state, acceptedTerms:undefined }
        case NOT_ACCEPTED_TERMS:
            return{ ...state, acceptedTerms:false, loading:false,data:action.payload }
        case GET_LOGED_SUCCESS:
            return{ ...state, loged:true}
        case GET_LOGED_ERROR:
            return{ ...state, loged:false }
        default:
            return { ...state };
    }
}

export const fetchLoginStart = () => {
    return {
        type: GET_LOGIN_START
    }
}

export const fetchLogin = (response) => {
    return {
        type: GET_LOGIN_SUCCESS,
        payload: response
    }
}

export const fetchLoginError = (error) => {
    return {
        type: GET_LOGIN_ERROR,
        payload: error
    }
}

export const fetchLogOutError = (error) => {
    return {
        type: GET_LOGOUT_ERROR,
        payload: error
    }
}

export const fetchLogoutStart = () => {
    return {
        type: GET_LOGOUT_START
    }
}

export const fetchLogOut = (response) => {
    return {
        type: GET_LOGOUT_SUCCESS,
        payload: response
    }
}

export const fetchInitialState = () => {
    return {
        type: INITIAL_STATE_AUTHENTICATE
    }
}

export const setInitialStateAuthenticate = () =>{
    return (dispatch) => {
        dispatch(fetchInitialState());
    }
}

export const fetchSetNotAcceptedTerms = (response) => {
    return {
        type: NOT_ACCEPTED_TERMS,
        payload:response
    }
}

export const fetchClearNotAcceptedTerms = (response) => {
    return {
        type: CLEAR_NOT_ACCEPTED_TERMS,
        payload:response
    }
}

export const login = (payload) => {
    return async (dispatch) => {
        try {
            await checkInternetConnection();
            dispatch(fetchLoginStart());
            const options = {
                method: POST_METHOD,
                endpoint: '/auth/session',
                data: payload
            }
            const response = await executiveApiCall(options);
            const decodedPayload = jwt(response.data.token);
            await saveItem(ACCESS_TOKEN, response.data.token);
            if(decodedPayload.executive.areAcceptedTerms ){
                await saveItem(USER_DATA, JSON.stringify(decodedPayload.executive));
                dispatch(fetchLogin(decodedPayload.executive));
            }else{
                dispatch(fetchSetNotAcceptedTerms(decodedPayload.executive));
            }
        } catch (error) {
            const messageError = handleErrorResponse(error);
            dispatch(fetchLoginError(messageError));
        }
    }
}

export const fetchIsLoged = () => {
    return {
        type: GET_LOGED_SUCCESS
    }
}

export const fetchIsLogedError = (response) => {
    return {
        type: GET_LOGED_ERROR,
        payload: response
    }
}

export const setIsLoged = (payload) => {
    return async (dispatch) => {
        try {
            await saveItem(USER_DATA,payload);
            dispatch(fetchIsLoged());
        } catch (error) {
            console.log(error);
            dispatch(fetchIsLogedError(error));
        }
    }
}

export const logOut = () => {
    return async (dispatch) => {
        try {
            dispatch(fetchLogoutStart())
            await eraseItem(ACCESS_TOKEN);
            dispatch(fetchLogOut(""));
        } catch (error) {
            console.log(error);
            dispatch(fetchLogOutError(error));
        }
    }
}
