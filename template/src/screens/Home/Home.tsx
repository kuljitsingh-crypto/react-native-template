import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {container, normalFont} from '../../styles/appDefaultStyle';
import {FormatedMessage, PrimaryButton} from '../../components';
import {screenNames} from '../screenNames';
import {NativePushNotification, ScreenNavigation} from '../../hooks';

type HomeProps = ScreenNavigation<'home'>;
const Home = (props: HomeProps) => {
  const {navigation} = props;
  const goToProfile = () => {
    navigation.navigate(screenNames.profile, {username: 'abc'});
  };

  const settings =
    NativePushNotification.useRequestPushNotificationPermission();

  const func = async () => {
    const {onServiceComplete} =
      await NativePushNotification.notification.foregroundService.create({
        notificationDetails: {
          body: 'test',
          title: 'test',
          android: {
            asForegroundService: true,
            colorized: true,
            color: '#000000',
          },
        },
        onServiceUpdate: ({notification, updateNotification}) => {
          console.log('update notification', notification);
        },
        eventObservers: {
          PRESS: [
            details => {
              {
                console.log('from frogroundService', details);
              }
            },
          ],
        },
      });

    setTimeout(() => {
      onServiceComplete();
      NativePushNotification.notification.show({
        notificationDetails: {
          body: 'test2',
          title: 'test2',
          android: {
            pressAction: {id: 'default'},
          },
        },
      });
    }, 60000);
  };

  useEffect(() => {
    NativePushNotification.notification.remote.getFCMToken().then(resp => {
      console.log(resp);
    });
  }, []);

  console.log(settings);
  return (
    <View style={container}>
      <FormatedMessage
        id="Home.greeting"
        values={{name: 'abc'}}
        style={normalFont}
      />

      <PrimaryButton onPress={goToProfile}>
        <FormatedMessage id="Home.goToProfile" />
      </PrimaryButton>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
