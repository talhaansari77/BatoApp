import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { ar } from './locales/ar';
import { en } from './locales/en';

export type AppLanguage = 'en' | 'ar';

export const LANGUAGE_STORAGE_KEY = 'bato.language';

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export async function loadSavedLanguage(): Promise<AppLanguage> {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (savedLanguage === 'ar' || savedLanguage === 'en') {
      await i18n.changeLanguage(savedLanguage);
      return savedLanguage;
    }

    return 'en';
  } catch {
    return 'en';
  }
}

export default i18n;