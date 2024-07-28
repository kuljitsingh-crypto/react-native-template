import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { container } from "../../styles/appDefaultStyle";
import { NamedLink } from "../../components";

const Login = () => {
  return (
    <View
      style={{ ...container, flexDirection: "row", alignItems: "flex-start" }}>
      <Text>Login</Text>
      <NamedLink name='profile' params={{ username: "abe" }}>
        Go to home
      </NamedLink>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});
