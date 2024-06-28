export const apiBaseUrl = () => {
  const url = process.env.API_SERVER_BASE_URL;
  if (url) return url;
  return "http://localhost:3500";
};
