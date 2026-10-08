import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, TranslationDictionary, TRANSLATIONS, LANGUAGES, LanguageMeta } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: TranslationDictionary;
  dir: 'ltr' | 'rtl';
  languagesList: LanguageMeta[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  const currentMeta = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const dir = currentMeta.dir;
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dir,
        languagesList: LANGUAGES,
      }}
    >
      <div dir={dir} className={dir === 'rtl' ? 'font-sans text-right' : 'font-sans text-left'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
