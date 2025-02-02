import {
  AsyncThunkOptions,
  AsyncThunkPayloadCreator,
  GetThunkAPI,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { AppDispatchType, RootStateType } from "../../store";

type ThunkConfig = {
  extra?: unknown;
  rejectValue?: unknown;
  serializedErrorType?: unknown;
  pendingMeta?: unknown;
  fulfilledMeta?: unknown;
  rejectedMeta?: unknown;
  state: RootStateType;
  dispatch: AppDispatchType;
};

const customReduxErrorCb = <Returned, ThunkArg>(
  func: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkConfig>
) => {
  return async function (params: ThunkArg, options: GetThunkAPI<ThunkConfig>) {
    const { rejectWithValue } = options;
    try {
      const data = await func(params, options);
      return data;
    } catch (err: any) {
      const { headers, ...rest } = err;
      return rejectWithValue(rest);
    }
  };
};

export const createCustomAsyncThunk = <
  Returned extends unknown = unknown,
  ThunkArg extends unknown = void
>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkConfig>,
  options?: AsyncThunkOptions<ThunkArg, ThunkConfig>
) => {
  const customErroWrappedPaylodCreator = customReduxErrorCb(payloadCreator);
  return createAsyncThunk(typePrefix, customErroWrappedPaylodCreator, options);
};
