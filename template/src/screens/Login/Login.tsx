import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {container} from '../../styles/appDefaultStyle';
import {NamedLink} from '../../components';
import {useIntl} from '../../hooks';

const Login = () => {
  const {formatMessage} = useIntl();

  return (
    <View
      style={{
        ...container,
        paddingTop: 0,
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}>
      <NamedLink name="home">{formatMessage('Login.goHome')}</NamedLink>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
