import CookieManager, {Cookie} from '@react-native-cookies/cookies';
import EncryptedStorage from 'react-native-encrypted-storage';

type methodType = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
type OptionsType = Omit<RequestInit, 'method' | 'body' | 'credentials'> & {
  useWebKit?: boolean;
  body?: any;
  credentials?: boolean;
  params?: Record<string, unknown>;
  csrfToken?: string;
};

const originWithProtocolRegex = /^(https?:\/\/[^\/]+)/;
const originWithoutProtocolRegex = /^https?:\/\/([^\/]+)/;

const getOrigin = (urlString: string, withHttps = true) => {
  const pattern = withHttps
    ? originWithProtocolRegex
    : originWithoutProtocolRegex;
  const match = urlString.match(pattern);
  return match ? match[1] : null;
};
const addCookieValue = (cookieString: string, cookieObj: Cookie) => {
  const [key, value] = cookieString.split('=');
  const trimmedKey = key.trim();
  switch (trimmedKey) {
    case 'Path':
    case 'path':
      cookieObj.path = value;
      break;
    case 'Domain':
    case 'domain':
      cookieObj.domain = value;
      break;
    case 'Expires':
    case 'expires':
      cookieObj.expires = value;
      break;
    case 'HttpOnly':
    case 'httpOnly':
    case 'httponly':
      cookieObj.httpOnly = true;
      break;
    case 'Version':
    case 'version':
      cookieObj.version = value;
      break;
    case 'Secure':
    case 'secure':
      cookieObj.secure = true;
      break;
    default:
      break;
  }
};

const getUserCookie = (resp: Response) => {
  const cookie = resp.headers.get('set-cookie');
  const isValidCookie = cookie && typeof cookie === 'string';
  if (!isValidCookie) return undefined;
  const [requiredCookie, ...restCookies] = cookie.split(';');
  const cookieObj = {} as Cookie;
  const [key, value] = requiredCookie.split('=');
  cookieObj.name = key;
  cookieObj.value = value;
  restCookies.reduce((acc, cookie) => {
    addCookieValue(cookie, acc);
    return acc;
  }, cookieObj);
  return cookieObj;
};

const updateCookieStore = (resp: Response) => {
  const url = resp.url;
  const cookie = getUserCookie(resp);
  const keyName = getOrigin(url, false);
  if (!keyName) return Promise.resolve(undefined);
  const shouldRemoveCookie = cookie && !cookie.value;
  if (shouldRemoveCookie) {
    return EncryptedStorage.removeItem(keyName);
  } else if (cookie) {
    return EncryptedStorage.setItem(keyName, JSON.stringify(cookie));
  }
};

const getCookieStoreValue = async (requestUrl: string) => {
  const keyName = getOrigin(requestUrl, false);
  const origin = getOrigin(requestUrl);
  if (!keyName) return undefined;
  try {
    const value = await EncryptedStorage.getItem(keyName);
    if (!value) return undefined;
    const objValue = JSON.parse(value);
    return {origin, cookie: objValue};
  } catch (err) {
    return undefined;
  }
};

const checkAndAddCookieToRequest = async (
  url: string,
  options?: OptionsType,
) => {
  const {useWebKit = false, credentials = false} = options || {};
  await CookieManager.clearAll();
  if (credentials) {
    const data = await getCookieStoreValue(url);
    if (data && data.origin && data.cookie) {
      await CookieManager.set(data.origin, data.cookie, useWebKit);
    }
  }
};

const getResponseData = (resp: Response) => {
  const [contentType] = resp.headers.get('content-type')?.split(';') || [];
  if (!contentType) return resp.text();
  switch (contentType) {
    case 'application/json':
    case 'application/ld+json':
    case 'model/gltf+json':
    case 'model/gltf-binary':
    case 'model/vnd.collada+xml':
      return resp.json();
    case 'application/x-www-form-urlencoded':
    case 'text/css':
    case 'text/html':
    case 'text/xml':
    case 'text/csv':
    case 'text/plain':
      return resp.text();
    case 'multipart/form-data':
      return resp.formData();
    default:
      return resp.blob();
  }
};

const getExtraOptions = (method: methodType, options?: OptionsType) => {
  const {
    headers,
    method: methd,
    body,
    cookie,
    credentials,
    useWebKit,
    csrfToken,
    ...rest
  } = (options || {}) as any;
  const finalHeaders: Record<string, any> = {
    'Content-type': 'application/json',
  };
  if (headers) {
    Object.assign(finalHeaders, headers);
  }
  if (csrfToken && typeof csrfToken === 'string') {
    finalHeaders['X-CSRF-TOKEN'] = csrfToken;
  }
  const bodyMayBe =
    method === 'GET'
      ? {}
      : body
      ? typeof body === 'object'
        ? {body: JSON.stringify(body)}
        : {body}
      : {};
  const validOptions = {headers: finalHeaders, ...bodyMayBe, ...rest};
  return validOptions;
};

const fromParamToQuery = (url: URL, params?: Record<string, unknown>) => {
  const isValidParams =
    params !== null &&
    params !== undefined &&
    typeof params === 'object' &&
    params.constructor === Object;
  if (!isValidParams) return;
  const paramEntries = Object.entries(params);
  if (!paramEntries.length) return;
  let param;
  for (param of paramEntries) {
    const [key, value] = param;
    const finalValue =
      value instanceof Date
        ? value.toISOString()
        : typeof value === 'object'
        ? JSON.stringify(value)
        : (value || '').toString();
    url.searchParams.set(key, finalValue);
  }
};

const mergeQueryFromUrlAndParams = (
  rawUrl: string,
  params?: Record<string, unknown>,
) => {
  const url = new URL(rawUrl);
  fromParamToQuery(url, params);
  const finalUrl = url.href;
  return finalUrl;
};

const fetchWrapper = async (
  url: string,
  method: methodType,
  options?: OptionsType,
) => {
  try {
    await checkAndAddCookieToRequest(url, options);
    const finalUrl = mergeQueryFromUrlAndParams(url, options?.params);
    const extraOptions = getExtraOptions(method, options);
    const resp = await fetch(finalUrl, {
      method,
      ...extraOptions,
    });
    if (resp.status >= 400) {
      const err = new Error() as any;
      err.status = resp.status;
      err.message = resp.statusText;
      err.data = await getResponseData(resp);
      err.headers = resp.headers;
      throw err;
    }
    await updateCookieStore(resp);
    const data = await getResponseData(resp);
    return {data};
  } catch (e: any) {
    const errObject = e as {
      status: number;
      message: string;
      data?: unknown;
      headers: Response['headers'];
    };
    return Promise.reject(errObject);
  }
};

const fetchStore = {
  get(url: string, options?: OptionsType) {
    return fetchWrapper(url, 'GET', options);
  },
  post(url: string, options?: OptionsType) {
    return fetchWrapper(url, 'POST', options);
  },
  put(url: string, options?: OptionsType) {
    return fetchWrapper(url, 'PUT', options);
  },
  patch(url: string, options?: OptionsType) {
    return fetchWrapper(url, 'PATCH', options);
  },
  delete(url: string, options?: OptionsType) {
    return fetchWrapper(url, 'DELETE', options);
  },
};

export default fetchStore;
