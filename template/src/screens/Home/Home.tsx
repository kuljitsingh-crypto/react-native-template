import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { container, normalFont } from "../../styles/appDefaultStyle";
import { FormatedMessage, PrimaryButton } from "../../components";
import { screenNames } from "../screenNames";
import { ScreenNavigation } from "../../hooks";

type HomeProps = ScreenNavigation<"home">;
const Home = (props: HomeProps) => {
  const { navigation } = props;
  const goToProfile = () => {
    navigation.navigate(screenNames.profile, { username: "abc" });
  };
  return (
    <View style={container}>
      <FormatedMessage
        id='Home.greeting'
        values={{ name: "abc" }}
        style={normalFont}
      />
      <PrimaryButton onPress={goToProfile}>
        <FormatedMessage id='Home.goToProfile' />
      </PrimaryButton>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
