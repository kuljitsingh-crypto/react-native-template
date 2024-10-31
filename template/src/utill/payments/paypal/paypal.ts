// Use only when you do not have any backend server
// TO generate the access token for first time, follow this https://medium.com/zestgeek/paypal-integration-in-react-native-9d447df4fce1
// After the genreting the access token, use this access token to get the refresh token and
//use that refersh token as Authorization to use Paypal Services.

import {apiBaseUrl} from '../../api';
import nativeFetch from '../../fetchStore';

// It is recommended to use backend server to generate and store the access token.
const paypalAccessToken = process.env.PAYPAL_ACCESS_TOKEN;

// Use only when you do not have any backend server
const paypaApiBaseUrl = process.env.PAYPAL_API_BASE_URL;

console.log(paypalAccessToken);

const PAYPAL_PATH = {
  CREATE_ORDER: '/create-order',
};

// TO use Paypal payment  you need a backend server that generate auth token
// to complete the any payment request or any other service requests.
export class Paypal {
  static #usePaypalFromApp = !!(paypalAccessToken && paypaApiBaseUrl);

  static async #callBackendServerWith() {
    await Paypal.#getPaypalRefreshToken();
  }
  static #getPaypalBasUrl = () => {
    if (Paypal.#usePaypalFromApp) {
      return paypaApiBaseUrl;
    }
    // customize this as per your server configuration
    const apiServerUrl = apiBaseUrl();
    const url = `${apiServerUrl}/paypal`;
    return url;
  };

  // Use this method only when you don't have a backend server
  static #getPaypalRefreshToken = async () => {
    const apiServerUrl = Paypal.#getPaypalBasUrl();
    if (!apiServerUrl) {
      throw new Error('Paypal api base url required!');
    }
    const urlSchema = new URLSearchParams({
      grant_type: 'client_credentials',
    });
    const config = {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${paypalAccessToken}`,
      },
      body: urlSchema,
    };

    const url = `${apiServerUrl}/v1/oauth2/token`;
    const resp = await nativeFetch.post(url, config);
    console.log(resp, 'resp');
    const data = resp.data;
    console.log(data);
  };

  static createOrder = async () => {
    try {
      await Paypal.#callBackendServerWith();
    } catch (e) {
      console.log(e.data);
    }
  };
}

Paypal.createOrder();
