import {config} from './config';

export const apiBaseUrl = () => {
  const url = config.API_SERVER_BASE_URL;
  if (url) return url;
  return 'http://localhost:3500';
};
