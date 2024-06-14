/**
 * @format
 */
import "react-native-url-polyfill/auto";
import "./src/i18n/i18n.config";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
