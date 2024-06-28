import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenParamList, ScreenValue } from "../screens/screenNames";

type NavigationType = NativeStackScreenProps<ScreenParamList>["navigation"];
type RouteType = NativeStackScreenProps<ScreenParamList>["route"];
export function useScreenNavigation() {
  const navigation = useNavigation<NavigationType>();
  return navigation;
}
export function useScreenRoute() {
  const routeInfo = useRoute<RouteType>();
  return routeInfo;
}

export type ScreenNavigation<TName extends ScreenValue> =
  NativeStackScreenProps<ScreenParamList, TName>;
