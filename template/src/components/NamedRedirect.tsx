import React, { useEffect } from "react";
import {
  ScreenParamKey,
  ScreenParamList,
  ScreenRouteType,
  ScreenValue,
} from "../screens/screenNames";
import { useScreenNavigation } from "../hooks";

type RouteName = ScreenValue;

type RouteProps<Tname extends ScreenParamKey> = ScreenRouteType<Tname>;
type NamedLinkProps<Tname extends ScreenParamKey> = {
  replace?: boolean;
} & RouteProps<Tname>;
const NamedRedirect = <Tname extends ScreenParamKey>(
  props: NamedLinkProps<Tname>
) => {
  const navigation = useScreenNavigation();
  const { replace, name, params } = props;
  const onNavigate = () => {
    if (replace) {
      navigation.replace(name, params as ScreenParamList[Tname]);
    } else {
      navigation.push(name, params as ScreenParamList[Tname]);
    }
  };
  useEffect(() => {
    onNavigate();
  }, []);
  return null;
};

export default NamedRedirect;
