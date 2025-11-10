import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import pt from './locales/pt.json';
import es from './locales/es.json';

const resources = {
  pt: { translation: pt },
  es: { translation: es },
};

export function initI18n() {
  if (i18n.isInitialized) return i18n;

  const deviceLocales = Localization.getLocales?.() ?? [];
  const primary = deviceLocales[0]?.languageCode ?? 'pt';
  const fallbackLng = ['pt', 'es'];

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: primary,
      fallbackLng,
      compatibilityJSON: 'v3',
      interpolation: { escapeValue: false },
    });

  return i18n;
}

export default i18n;
