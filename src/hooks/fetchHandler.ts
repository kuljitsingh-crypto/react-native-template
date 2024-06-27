import { useEffect } from "react";
import { FETCH_STATUS, FetchStatusValues } from "../custom-config";

export function useSucessHandler(
  fetchStatus: FetchStatusValues,
  callback: Function,
  ...funcArgs: any
) {
  useEffect(() => {
    if (fetchStatus === FETCH_STATUS.succeeded) {
      callback(...funcArgs);
    }
  }, [fetchStatus]);
}

export function useErrorHandler(
  fetchStatus: FetchStatusValues,
  callback: Function,
  ...funcArgs: any
) {
  useEffect(() => {
    if (fetchStatus === FETCH_STATUS.failed) {
      callback(...funcArgs);
    }
  }, [fetchStatus]);
}
