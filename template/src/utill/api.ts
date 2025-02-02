export const apiBaseUrl = () => {
  const url = process.env.API_SERVER_BASE_URL;
  if (!url) {
    throw new Error('API_SERVER_BASE_URL is required before using it.');
  }
  return `${url}/api`;
};
