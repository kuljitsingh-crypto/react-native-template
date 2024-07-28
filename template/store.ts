import {configureStore} from '@reduxjs/toolkit';
import {reducer} from './reducers';
import {TypedUseSelectorHook} from 'react-redux';

export function createStore(preloadedState = {}) {
  return configureStore({
    reducer: reducer,
    preloadedState,
  });
}

export type StoreType = ReturnType<typeof createStore>;
export type RootStateType = ReturnType<StoreType['getState']>;
export type AppDispatchType = StoreType['dispatch'];
export type AppSelectorType = TypedUseSelectorHook<RootStateType>;
