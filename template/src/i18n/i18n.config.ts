import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {en, fr} from './translation';
import {NativeModules, Platform} from 'react-native';
import {getLocales} from 'react-native-localize';

const resources = {
  'en-US': {translation: en},
  'fr-FR': {translation: fr},
  // add translation support for different languages
};

i18n.use(initReactI18next).init({
  lng: 'en-US',
  compatibilityJSON: 'v3',
  resources,
  fallbackLng: 'en-US',
});

const userLang = getLocales()[0].languageCode;

i18n.changeLanguage(userLang);

export default i18n;
