import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {container} from '../../styles/appDefaultStyle';
import {FormatedMessage, PrimaryButton} from '../../components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenParamList, screenNames} from '../ScreenTypes';

type HomeProps = NativeStackScreenProps<ScreenParamList, 'home'>;
const Home = (props: HomeProps) => {
  const {navigation} = props;
  const goToProfile = () => {
    navigation.navigate(screenNames.profile);
  };
  return (
    <View style={container}>
      <FormatedMessage id="Home.greeting" />
      <PrimaryButton onPress={goToProfile}>
        <FormatedMessage id="Home.goToProfile" />
      </PrimaryButton>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
