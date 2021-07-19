import { prospectApiCall } from "..";
import { ACCESS_TOKEN, POST_METHOD, GET_METHOD } from "../../../consts";
import {
  buildUrlParams,
  getItem,
  handleErrorResponse,
  checkInternetConnection,
} from "../../../utils";

export const requestProspect = async (payload) => {
  try {
    await checkInternetConnection();
    const token = await getItem(ACCESS_TOKEN);
    const options = {
      method: POST_METHOD,
      endpoint: "",
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await prospectApiCall(options);
    return response.data.payload;
  } catch (error) {
    const messageError = handleErrorResponse(error);
    throw new Error(messageError);
  }
};

export const getProspects = async (params, page, size, orders) => {
  try {
    await checkInternetConnection();
    const token = await getItem(ACCESS_TOKEN);
    const options = {
      method: GET_METHOD,
      endpoint: buildUrlParams(params, page, size, orders),
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await prospectApiCall(options);
    return response ? response.data : response;
  } catch (error) {
    const messageError = handleErrorResponse(error);
    throw new Error(messageError);
  }
};
