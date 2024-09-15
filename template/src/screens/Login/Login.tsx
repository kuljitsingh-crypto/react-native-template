import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {container} from '../../styles/appDefaultStyle';
import {FormatedMessage, NamedLink} from '../../components';
import {useIntl} from '../../hooks';

const Login = () => {
  const {formatMessage} = useIntl();
  return (
    <View
      style={{
        ...container,
        paddingTop: 0,
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}>
      <NamedLink name="profile" params={{username: 'abe'}}>
        {formatMessage('Login.goHome')}
      </NamedLink>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
