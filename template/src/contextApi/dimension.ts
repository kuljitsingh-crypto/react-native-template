import React, {useContext} from 'react';
import {ScaledSize} from 'react-native';

export type DimensionsContextType = ScaledSize;
export const DimensionsContext = React.createContext(
  {} as DimensionsContextType,
);

export const useDeviceDimensions = () => {
  const context = useContext(DimensionsContext);
  return context;
};
