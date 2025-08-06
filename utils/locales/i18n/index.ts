// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import en from '../en.json';
// import ar from '../ar.json';

// i18n
//   .use(initReactI18next)
//   .init({
//     compatibilityJSON: 'v4',
//     lng: 'en',
//     fallbackLng: 'en',
//     resources: {
//       en: { translation: en },
//       ar: { translation: ar },
//     },
//     interpolation: {
//       escapeValue: false,
//     },
//   });

// export default i18n;


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../en.json';
import ar from '../ar.json';

const LANGUAGE_KEY = 'user-language';

export const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

const DEFAULT_LANG = 'en';

const configureRTL = async (lang: string) => {
  const isRTL = lang === 'ar';

  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    if (Platform.OS === 'android') {
      // TODO
      // Force restart for RTL to apply properly
      console.warn('RTL change requires app restart.');
    }
  }
};

const initLanguage = async (): Promise<string> => {
  try {
    const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
    return savedLang || DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
};

export const initLocalization = async () => {
  const lng = await initLanguage();
  await configureRTL(lng);

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng,
      fallbackLng: DEFAULT_LANG,
      compatibilityJSON: 'v4',
      interpolation: {
        escapeValue: false,
      },
    });
};

export const changeLanguage = async (lang: 'en' | 'ar') => {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await i18n.changeLanguage(lang);
  await configureRTL(lang);
};

export default i18n;
