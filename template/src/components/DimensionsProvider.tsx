import {Dimensions, SafeAreaView} from 'react-native';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import {DimensionsContext, DimensionsContextType} from '../contextApi';
import {rootContainer} from '../styles/appDefaultStyle';

const DimensionsProvider = (props: PropsWithChildren) => {
  const {children} = props;
  const [dimensions, setDimensions] = useState<DimensionsContextType>(() =>
    getDimensionOf('window'),
  );

  function getDimensionOf(name: 'window' | 'screen') {
    return Dimensions.get(name);
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  });
  return (
    <DimensionsContext.Provider value={dimensions}>
      <SafeAreaView style={rootContainer}>{children}</SafeAreaView>
    </DimensionsContext.Provider>
  );
};

export default DimensionsProvider;
