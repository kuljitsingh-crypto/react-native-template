import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { screenConfigurations } from "./src/screens/screenConfiguration";
import { screenHoc } from "./src/screens/screenHoc";
import { ScreenParamList } from "./src/screens/screenNames";
import { AppDispatchType } from "./store";

const Stack = createNativeStackNavigator<ScreenParamList>();

const AppNavigator = (props: { dispatch: AppDispatchType }) => {
  const { dispatch } = props;
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {screenConfigurations().map((config) => {
          return (
            <Stack.Screen
              component={screenHoc(config, dispatch)}
              name={config.name}
              options={config.options}
              key={config.name}
            />
          );
        })}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
