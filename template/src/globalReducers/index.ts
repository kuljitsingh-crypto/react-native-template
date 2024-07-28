import userReducer from './userSlice';
import deepLinkeducer from './deepLinkSlice';

export const reducer = {
  user: userReducer,
  deepLink: deepLinkeducer,
};
