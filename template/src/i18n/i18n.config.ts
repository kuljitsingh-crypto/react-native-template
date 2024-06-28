import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {en, fr} from './translation';
import {NativeModules, I18nManager, Platform} from 'react-native';

const resources = {
  en_US: {translation: en},
  fr_FR: {translation: fr},
  // add translation support for different languages
};

i18n.use(initReactI18next).init({
  lng: 'en_US',
  compatibilityJSON: 'v3',
  resources,
  fallbackLng: 'en_US',
});

const userLang =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale
    : NativeModules.I18nManager.localeIdentifier;

i18n.changeLanguage(userLang);

export default i18n;
