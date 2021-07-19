import { procedureApiCall } from '../api';
import { GET_METHOD, ACCESS_TOKEN } from '../../consts';
import { handleErrorResponse, getItem, 
    checkInternetConnection, buildUrlParams } from '../../utils';

const initialState = {
    data: [],
    error: '',
    loading: false,
    success: false,
};

const GET_STATES_STARTING = 'GET_STATES_STARTING';
const GET_STATES_SUCCESSFULL = "GET_STATES_SUCCESSFULL";
const GET_STATES_ERROR = "GET_STATES_ERROR";
const WORKLOW_INITIAL_STATE = "WORKLOW_INITIAL_STATE";


export default function workflowReducer(state = initialState, action = {}) {
    switch (action.type) {
        case GET_STATES_STARTING:
            return { ...state, error: '', loading: true, success: false};
        case GET_STATES_SUCCESSFULL:
            return { ...state, loading: false, success: true, data:action.payload };
        case GET_STATES_ERROR:
            return { ...state, error: action.payload, loading: false };
        case WORKLOW_INITIAL_STATE:
            return{ initialState } 
        default:
            return { ...state };
    }
}

export const fetchInitialState = () => {
    return {
        type: WORKLOW_INITIAL_STATE
    }
}

export const setInitialStateWorkflow = () =>{
    return (dispatch) => {
        dispatch(fetchInitialState());
    }
}

export const fetchStarting = () => {
    return {
        type: GET_STATES_STARTING
    }
}

export const fetchGetStatesSuccessfull = (response) => {
    return {
        type: GET_STATES_SUCCESSFULL,
        payload: response
    }
}

export const fetchGetStatesError = (response) => {
    return {
        type: GET_STATES_ERROR,
        payload: response
    }
}

export const getStates = (payload) =>  {
    return async dispatch => {
        try {
            let response = [];
            dispatch(fetchStarting());
            await checkInternetConnection();
            const token = await getItem(ACCESS_TOKEN);
            const options = {
                method: GET_METHOD,
                endpoint: '/states'+buildUrlParams(payload,undefined,undefined),
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            response = await procedureApiCall(options);
            dispatch(fetchGetStatesSuccessfull(response.data));
        } catch (error) {
            const messageError = handleErrorResponse(error);
            dispatch(fetchGetStatesError(messageError));
        }
    }
}
