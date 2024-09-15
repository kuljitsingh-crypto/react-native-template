import React from 'react';
import AppNavigator from './AppNavigator';
import {createStore} from './store';
import {Provider} from 'react-redux';
import {
  DimensionsProvider,
  PushNotificationProvider,
  SimpleToastProvider,
} from './src/components';
import {useDeepLink} from './src/deepLink';
import {View} from 'react-native';
import {colors} from './src/constants';

//for permission implmentation go to  https://github.com/zoontek/react-native-permissions
// and implment the logic for the permission and uncommnet the permision in
// ios/projectname/info.plist, ios/podfile, android/app/src/main/AndoidMainfest.xml

const DeepLinkWrapper = ({children}: {children: React.JSX.Element}) => {
  useDeepLink();
  return <View style={{flex: 1}}>{children}</View>;
};

const App = () => {
  const store = createStore();
  const {dispatch} = store;

  return (
    <DimensionsProvider>
      <Provider store={store}>
        <DeepLinkWrapper>
          <PushNotificationProvider>
            <SimpleToastProvider
              infoColor={colors.infoToast}
              successColor={colors.successToast}
              errorColor={colors.errorToast}>
              <AppNavigator dispatch={dispatch} />
            </SimpleToastProvider>
          </PushNotificationProvider>
        </DeepLinkWrapper>
      </Provider>
    </DimensionsProvider>
  );
};

export default App;
