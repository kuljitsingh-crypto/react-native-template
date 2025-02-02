import {useEffect} from 'react';
import {config, FetchStatusValues} from '../custom-config';

export function useSucessHandler(
  fetchStatus: FetchStatusValues,
  callback: Function,
  ...funcArgs: any
) {
  useEffect(() => {
    if (fetchStatus === config.fetchStatus.succeeded) {
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
    if (fetchStatus === config.fetchStatus.failed) {
      callback(...funcArgs);
    }
  }, [fetchStatus]);
}
