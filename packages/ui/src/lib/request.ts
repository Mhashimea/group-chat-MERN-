import axios, { AxiosRequestConfig } from 'axios';

/**
 * Base url for the api requests.
 */
const BASE_URL = 'http://localhost:3000/api';

/**
 * Generic method to handle the api error.
 */
// eslint-disable-next-line
export function handleApiError(error: any) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return error.response.data;
  } else if (error.request) {
    // The request was made but no response was received
    return { message: 'Network Error. Please try again' };
  } else {
    // Something happened in setting up the request that triggered an Error
    return { message: 'Network Error. Please try again' };
  }
}

/**
 * Common method to send the api requests.
 * This will take the authorization token from the localstorage
 * and append to the  request header.
 *
 * @param config AxiosRequestConfig object which is same as fetch parameters
 * @returns axios axios response data
 */
export function doRequest(config: AxiosRequestConfig) {
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
  return axios
    .request(config)
    .then((response) => response.data)
    .catch((error) => handleApiError(error));
}

/**
 * Shortcut method to send the GET request.
 *
 * @param url - api url
 * @param params - query params
 * @param config - additional axios config
 * @returns - axios response data
 */
export const httpGet = (url: string, params = {}, config?: AxiosRequestConfig) =>
  doRequest({ params, url: BASE_URL + url, method: 'GET', ...config });

/**
 * Shortcut method to send the POST request.
 *
 * @param url - api url
 * @param data - reuqest body
 * @param config - additional axios config
 * @returns - axios response data
 */
export const httpPost = (url: string, data = {}, config?: AxiosRequestConfig) => doRequest({ data, url: BASE_URL + url, method: 'POST', ...config });
