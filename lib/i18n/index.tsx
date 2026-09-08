import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { translations, type Locale } from './translations';

export type { Locale } from './translations';

const LOCALE_KEY = 'app_locale';

export const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'አማርኛ' },
  { code: 'am-Latn', label: 'Amharic (Latin)' },
  { code: 'om', label: 'Afaan Oromoo' },
];

type TranslationVars = Record<string, string>;

export function interpolate(text: string, vars?: TranslationVars): string {
  if (!vars) return text;
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, value),
    text,
  );
}

export function resolveTranslation(key: string, locale: Locale, vars?: TranslationVars): string {
  const entry = translations[key];
  if (!entry) return key;
  const text = entry[locale] ?? entry.en ?? key;
  return interpolate(text, vars);
}

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: TranslationVars) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    SecureStore.getItemAsync(LOCALE_KEY).then((stored) => {
      if (stored && LOCALES.some((l) => l.code === stored)) {
        setLocaleState(stored as Locale);
      }
    });
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    SecureStore.setItemAsync(LOCALE_KEY, next);
  }

  function t(key: string, vars?: TranslationVars): string {
    return resolveTranslation(key, locale, vars);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useT() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useT must be used within a LocaleProvider');
  return value.t;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale must be used within a LocaleProvider');
  return { locale: value.locale, setLocale: value.setLocale };
}
