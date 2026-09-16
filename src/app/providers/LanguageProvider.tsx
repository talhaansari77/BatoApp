import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { I18nManager } from 'react-native';

import i18n, {
  AppLanguage,
  LANGUAGE_STORAGE_KEY,
  loadSavedLanguage,
} from '../../core/i18n/i18n';

type LanguageContextValue = {
  language: AppLanguage;
  isRTL: boolean;
  setLanguage: (language: AppLanguage) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>('en');

  useEffect(() => {
    async function prepareLanguage() {
      try {
        const savedLanguage = await loadSavedLanguage();
        setLanguageState(savedLanguage);
      } catch (error) {
        console.warn('Failed to load saved language:', error);
        setLanguageState('en');
      }
    }

    prepareLanguage();
  }, []);

  const setLanguage = async (nextLanguage: AppLanguage) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
      await i18n.changeLanguage(nextLanguage);

      setLanguageState(nextLanguage);

      const shouldBeRTL = nextLanguage === 'ar';

      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
      }
    } catch (error) {
      console.warn('Failed to change language:', error);
    }
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      isRTL: language === 'ar',
      setLanguage,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useAppLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useAppLanguage must be used inside LanguageProvider');
  }

  return context;
}