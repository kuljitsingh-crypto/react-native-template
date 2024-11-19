import {apiBaseUrl} from '../../api';
import nativeFetch from '../../fetchStore';
import {LocalStorage} from '../../localStroage';
import {dateHelper} from '../../dateHelper';
import {config, PaypalPaymentType} from '../../../custom-config';
import {customCrypto} from '../../crypto';
import {CloudStroage} from '../../cloudStroage';

type SAVED_PAYPAL_ACCESS_TOKEN_TYPE = {accessToken: string; expiresIn: number};
type MethodType = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
type DataType = Omit<
  RequestInit,
  'method' | 'body' | 'credentials' | 'headers'
> & {
  body?: any;
  credentials?: boolean;
  params?: Record<string, unknown>;
  csrfToken?: string;
  headers?: Record<string, unknown>;
};
type PaypalCreateOrderType = {
  // For more info see https://developer.paypal.com/docs/api/orders/v2/#orders_create
  intent: 'CAPTURE' | 'AUTHORIZE';
  shippingPreference: 'GET_FROM_FILE' | 'NO_SHIPPING' | 'SET_PROVIDED_ADDRESS';
  customerId: string;
  providerId: string;
  brandName: string;
  paymentType: PaypalPaymentType;
  referenceId: string;
  finalAmmount: {value: number; currency: string}; //finalAmount = (item_total + tax_total + shipping + handling + insurance - shipping_discount - discount)
  itemsTotal: {value: number; currency: string};
  items: {
    name: string;
    quantity: number;
    description?: string;
    url?: string;
    image_url?: string;
    unit_amount: {currency_code: string; value: number};
  }[];
  taxTotal?: {value: number; currency: string};
  shipping?: {value: number; currency: string};
  handling?: {value: number; currency: string};
  insurance?: {value: number; currency: string};
  shippingDiscount?: {value: number; currency: string};
  discount?: {value: number; currency: string};
  generalDescription?: string;
  customId?: string;
  invoiceId?: string;
  emailAddress?: string;
  name?: {givenName: string; surName: string};
  locale?: string;
  approveRedirectUrl?: string;
  cancelRedirectUrl?: string;
};

const PAYPAL_ACCESS_TOKEN_KEY = 'PAYPAL_ACCESS_TOKEN';
const PAYPAL_MAX_DESCRIPTION_LENGTH = 127;

// Get new access token using Client ID and Client Secret,
//when old token is expires using either cloud function or lamda function or some small backend server
const GET_NEW_PAYPAL_ACCESS_TOKEN_WHEN_OLD_EXPIRES = true;

// For Paypal documentation, see https://developer.paypal.com/api/rest/

// Backend Sever = Any server or serverless  function like lamda/cloud function etc.,
// Use only when you do not have any backend server
// To generate the access token for first time, follow this https://medium.com/zestgeek/paypal-integration-in-react-native-9d447df4fce1
// After the genreting the access token, use this access token to get the refresh token and
//use that refersh token as Authorization to use Paypal Services.
// It is recommended to use backend server to generate and store the access token.
// Reasons to generate Access Token from backend server is that Access Token expires after 8-9 hours
// so you need to generate new Access Token after that.
// To remove this problem there is 3 ways
// 1) Use Backend Server (which is recommended one)
// 2) Save Client Id and Client Secret in app environment variable , But it is very bad idea.
// 3) After getting the access token for first time, get the referesh token and save that in Local Storage of app. Use that referesh token to get new token before time expires.
//    To do that you need to run background process, otherwise that might be possiblity that the refresh token expires before you get the new one. Once the refresh token expires
//    you can get the new token only using client id and secret like first time.
const paypalAccessToken = process.env.PAYPAL_ACCESS_TOKEN;

// Use only when you do not have any backend server
const paypaApiBaseUrl = process.env.PAYPAL_API_BASE_URL;

// TO use Paypal payment  you need a backend server that generate auth token
// to complete the any payment request or any other service requests.
export class Paypal {
  static #usePaypalFromApp = !!(paypalAccessToken && paypaApiBaseUrl);

  //================== heler methods =======================//
  static #getPaypalBasUrl = () => {
    if (Paypal.#usePaypalFromApp) {
      return paypaApiBaseUrl;
    }
    // customize this as per your server configuration
    const apiServerUrl = apiBaseUrl();
    const url = `${apiServerUrl}/paypal`;
    return url;
  };

  static async #getNewAccessTokenUsingClientIdAndSecret() {
    if (!GET_NEW_PAYPAL_ACCESS_TOKEN_WHEN_OLD_EXPIRES) {
      return paypalAccessToken;
    }
    // Add your custom logic if you do not want to use any backendserver for Paypal Pyments
    const tokenUrl = `${apiBaseUrl()}/paypal/access-token`;
    const resp = await nativeFetch.get(tokenUrl);
    const {access_token, expires_in} = resp.data;
    const expiresTime = dateHelper().add(expires_in, 'seconds').valueOf();
    const savedToken: SAVED_PAYPAL_ACCESS_TOKEN_TYPE = {
      accessToken: access_token,
      expiresIn: expiresTime,
    };

    await LocalStorage.setItem(PAYPAL_ACCESS_TOKEN_KEY, savedToken);
    return access_token;
  }

  // Use this method only when you don't have a backend server
  static #getPaypalAccessToken = async () => {
    const accessToken: SAVED_PAYPAL_ACCESS_TOKEN_TYPE | undefined | null =
      await LocalStorage.getItem(PAYPAL_ACCESS_TOKEN_KEY);
    const isTokenExpires = accessToken?.expiresIn
      ? dateHelper().isAfter(accessToken.expiresIn)
      : false;
    // When the access token expires, you have to get new access token using client Id and client Secret
    // and save it the local storage somehow
    // So it is better to use backedn server instead
    if (isTokenExpires) {
      // add new access token to the local storage and return that access token
      const accessToken =
        await Paypal.#getNewAccessTokenUsingClientIdAndSecret();
      return accessToken;
    }
    const isValidAccessToken = accessToken && accessToken.accessToken;

    if (isValidAccessToken) {
      return accessToken.accessToken;
    }
    return paypalAccessToken;
  };

  static #getRequestUrl(pathname: string) {
    // update your logic as per your needs
    const baseUrl = Paypal.#getPaypalBasUrl();
    if (!baseUrl) {
      throw new Error('Base URL is required');
    }
    const url = `${baseUrl}${pathname}`;
    return url;
  }

  // update your logic as per your needs
  static async #callBackendServerWith(
    pathname: string,
    method: MethodType,
    data?: DataType,
  ) {
    data = (data ?? {}) as Record<string, unknown>;
    if (Paypal.#usePaypalFromApp) {
      const accessToken = await Paypal.#getPaypalRefreshToken();
      data.headers = data.headers || {};
      data.headers['Content-type'] = 'application/json';
      data.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const url = Paypal.#getRequestUrl(pathname);
    switch (method) {
      case 'GET':
        return nativeFetch.get(url, data as any);
      case 'POST':
        return nativeFetch.post(url, data as any);
      case 'PUT':
        return nativeFetch.put(url, data as any);
      case 'PATCH':
        return nativeFetch.patch(url, data as any);
      case 'DELETE':
        return nativeFetch.delete(url, data as any);
      default: {
        throw new Error('Invalid method: ' + method);
      }
    }
  }

  // Use this method only when you don't have a backend server
  static #getPaypalRefreshToken = async () => {
    const apiServerUrl = Paypal.#getPaypalBasUrl();
    if (!apiServerUrl) {
      throw new Error('Paypal api base url required!');
    }
    const urlSchema = new URLSearchParams({
      grant_type: 'client_credentials',
    });
    const accessToken = await Paypal.#getPaypalAccessToken();
    console.log(accessToken, 'access token');
    const config = {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
      body: urlSchema.toString(),
    };
    const url = `${apiServerUrl}/v1/oauth2/token`;
    const resp = await nativeFetch.post(url, config);
    const {access_token, expires_in} = resp.data;
    const expiresTime = dateHelper().add(expires_in, 'seconds').valueOf();
    const savedToken: SAVED_PAYPAL_ACCESS_TOKEN_TYPE = {
      accessToken: access_token,
      expiresIn: expiresTime,
    };

    await LocalStorage.setItem(PAYPAL_ACCESS_TOKEN_KEY, savedToken);
    return accessToken as string;
  };

  // For more information about create order, see https://developer.paypal.com/docs/api/orders/v2/#orders_create
  static createOrder = async (
    orderDetails: PaypalCreateOrderType,
    throwErrorOnFail = false,
  ) => {
    const {
      customerId,
      providerId,
      locale,
      intent,
      brandName,
      paymentType,
      shippingPreference,
      emailAddress,
      name,
      approveRedirectUrl,
      cancelRedirectUrl,
      generalDescription,
      referenceId,
      customId,
      invoiceId,
      items,
      finalAmmount,
      itemsTotal,
      taxTotal,
      shipping,
      handling,
      insurance,
      shippingDiscount,
      discount,
    } = orderDetails;
    if (
      paymentType === config.paypalPaymentApproveUrlOpener.outsideApp &&
      !(approveRedirectUrl && cancelRedirectUrl)
    ) {
      throw new Error(
        'For "Outside App" type payment "approveRedirectUrl" and "cancelRedirectUrl" required. ',
      );
    }

    const description = generalDescription
      ? generalDescription.length > PAYPAL_MAX_DESCRIPTION_LENGTH
        ? generalDescription.substring(0, PAYPAL_MAX_DESCRIPTION_LENGTH - 3) +
          '...'
        : generalDescription
      : null;

    try {
      //(item_total + tax_total + shipping + handling + insurance - shipping_discount - discount)
      const paypalObj = {
        intent,
        purchase_units: [
          {
            reference_id: referenceId,
            amount: {
              currency_code: finalAmmount.currency,
              value: finalAmmount.value,
              breakdown: {
                item_total: {
                  currency_code: itemsTotal.currency,
                  value: itemsTotal.value,
                },
                ...(taxTotal
                  ? {
                      tax_total: {
                        currency_code: taxTotal.currency,
                        value: taxTotal.value,
                      },
                    }
                  : {}),
                ...(shipping
                  ? {
                      tax_total: {
                        currency_code: shipping.currency,
                        value: shipping.value,
                      },
                    }
                  : {}),
                ...(handling
                  ? {
                      tax_total: {
                        currency_code: handling.currency,
                        value: handling.value,
                      },
                    }
                  : {}),
                ...(insurance
                  ? {
                      tax_total: {
                        currency_code: insurance.currency,
                        value: insurance.value,
                      },
                    }
                  : {}),
                ...(shippingDiscount
                  ? {
                      tax_total: {
                        currency_code: shippingDiscount.currency,
                        value: shippingDiscount.value,
                      },
                    }
                  : {}),
                ...(discount
                  ? {
                      tax_total: {
                        currency_code: discount.currency,
                        value: discount.value,
                      },
                    }
                  : {}),
              },
            },
            items,
            ...(customId ? {custom_id: customId} : {}),
            ...(invoiceId ? {invoice_id: invoiceId} : {}),
            ...(description ? {description} : {}),
          },
        ],
        payment_source: {
          // Default payment source for paypal.
          // To add other payment sources see the paypal developer docs https://developer.paypal.com/docs/api/orders/v2/#orders_create
          paypal: {
            experience_context: {
              // Default payment method,To add other payment methods see the paypal developer docs.
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              // Default user action for payment. TO add other actions see the paypal developer docs.
              user_action: 'PAY_NOW',
              // Default paypal landing page. TO use other option see the paypal developer docs.
              landing_page: 'LOGIN',
              shipping_preference: shippingPreference,
              brand_name: brandName,
              locale: locale || 'en-US',
              return_url:
                approveRedirectUrl || config.paypalPaymentApproveRedirectUrl,
              cancel_url:
                cancelRedirectUrl || config.paypalPaymentCancelRedirectUrl,
            },
            ...(emailAddress ? {email_address: emailAddress} : {}),
            ...(name && name.givenName && name.surName
              ? {name: {given_name: name.givenName, surname: name.surName}}
              : {}),
          },
        },
      };
      const resp = await Paypal.#callBackendServerWith(
        '/v2/checkout/orders',
        'POST',
        {body: paypalObj},
      );

      const {links, id, status} = resp.data;
      const result = await CloudStroage.paypal.addPaypalOrderDetails({
        id: referenceId,
        orderDetails: {
          customId: customId || null,
          invoiceId: invoiceId || null,
          customerId,
          providerId,
          finalAmmount,
          taxTotal: taxTotal || null,
          handlingFee: handling || null,
          shippingFee: shipping || null,
          shippingDiscount: shippingDiscount || null,
          discount: discount || null,
          insuranceFee: insurance || null,
          paypaylOrderId: id,
          orderStatus: status,
        },
      });
      const approveUrl = links.find(
        (link: {rel: string; href: string}) => link.rel === 'payer-action',
      );
      console.log(links, result);
      // if (approveUrl) {
      //   Linking.openURL(approveUrl.href);
      // }
      // console.log(resp.data, approveUrl, 'data');
    } catch (e) {
      if (throwErrorOnFail) {
        throw e;
      }
      console.log(e, 'paypal-create-error');
    }
  };

  static orderStatus = async (orderId: string, throwErrorOnFail = false) => {
    try {
      const path = `/v2/checkout/orders/${orderId}`;
      const resp = await Paypal.#callBackendServerWith(path, 'GET');
      return resp.data;
    } catch (e) {
      if (throwErrorOnFail) {
        throw e;
      }
      console.log(e.data, 'paypal-order-status-error');
    }
  };

  static captureOrder = async (orderId: string, throwErrorOnFail = false) => {
    try {
      const path = `/v2/checkout/orders/${orderId}/capture`;
      const resp = await Paypal.#callBackendServerWith(path, 'POST');
      console.log(resp.data);
    } catch (e) {
      if (throwErrorOnFail) {
        throw e;
      }
      console.log(e, 'paypal-capture-error');
    }
  };
}

// Paypal.createOrder();
// Paypal.orderStatus('3GT372269P098020A').then(data => console.log(data));
// Paypal.createOrder({
//   customerId: 'cust-01',
//   providerId: 'prov-01',
//   intent: 'CAPTURE',
//   shippingPreference: 'NO_SHIPPING',
//   brandName: 'Ling Co.',
//   paymentType: config.paypalPaymentApproveUrlOpener.insideApp,
//   referenceId: customCrypto.randomUUID(),
//   finalAmmount: {value: 1000, currency: 'USD'},
//   itemsTotal: {value: 900, currency: 'USD'},
//   handling: {value: 100, currency: 'USD'},
//   items: [
//     {
//       name: 'Item1',
//       quantity: 2,
//       unit_amount: {currency_code: 'USD', value: 250},
//     },
//     {
//       name: 'Item2',
//       quantity: 2,
//       unit_amount: {currency_code: 'USD', value: 200},
//     },
//   ],
// });
