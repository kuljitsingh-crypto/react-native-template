export const storableError = (err: any) => {
  const errObject = err as {
    status: number;
    message: string;
    data?: unknown;
    headers: Response['headers'];
  };
  return errObject;
};
