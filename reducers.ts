import {reducer as globalReducer} from './src/globalReducers';
import {reducer as pageReducer} from './src/screens/screenReducers';

export const reducer = {
  ...globalReducer,
  ...pageReducer,
};
