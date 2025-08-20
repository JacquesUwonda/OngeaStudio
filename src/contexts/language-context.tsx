
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export const availableLanguages = [
  { value: "en", label: "English", ttsCode: "en-US" },
  { value: "fr", label: "French", ttsCode: "fr-FR" },
  { value: "sw", label: "Swahili", ttsCode: "sw-KE" },
  { value: "lin", label: "Lingala", ttsCode: "ln-CD" },
  { value: "es", label: "Spanish", ttsCode: "es-ES" },
  { value: "de", label: "German", ttsCode: "de-DE" },
  { value: "it", label: "Italian", ttsCode: "it-IT" },
  { value: "pt", label: "Portuguese", ttsCode: "pt-PT" },
  { value: "ru", label: "Russian", ttsCode: "ru-RU" },
  { value: "ar", label: "Arabic", ttsCode: "ar-SA" },
  { value: "zh", label: "Mandarin Chinese", ttsCode: "zh-CN" },
  { value: "ja", label: "Japanese", ttsCode: "ja-JP" },
  { value: "ko", label: "Korean", ttsCode: "ko-KR" },
];

export interface LanguageContextType {
  spokenLanguage: string;
  setSpokenLanguage: (lang: string) => void;
  learningLanguage: string;
  setLearningLanguage: (lang: string) => void;
  getLanguageLabel: (value: string) => string;
  getLanguageTtsCode: (value: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [spokenLanguage, setSpokenLanguageState] = useState<string>("en");
  const [learningLanguage, setLearningLanguageState] = useState<string>("fr");

  useEffect(() => {
    const storedSpokenLanguage = localStorage.getItem("spokenLanguage");
    if (storedSpokenLanguage) {
      setSpokenLanguageState(storedSpokenLanguage);
    }
    const storedLearningLanguage = localStorage.getItem("learningLanguage");
    if (storedLearningLanguage) {
      setLearningLanguageState(storedLearningLanguage);
    }
  }, []);

  const setSpokenLanguage = (lang: string) => {
    setSpokenLanguageState(lang);
    localStorage.setItem("spokenLanguage", lang);
  };

  const setLearningLanguage = (lang: string) => {
    setLearningLanguageState(lang);
    localStorage.setItem("learningLanguage", lang);
  };

  const getLanguageLabel = (value: string): string => {
    const lang = availableLanguages.find(l => l.value === value);
    return lang ? lang.label : value;
  };

  const getLanguageTtsCode = (value: string): string => {
    const lang = availableLanguages.find(l => l.value === value);
    return lang ? lang.ttsCode : value; // Fallback to value if no ttsCode found
  };
  
  return (
    <LanguageContext.Provider value={{ spokenLanguage, setSpokenLanguage, learningLanguage, setLearningLanguage, getLanguageLabel, getLanguageTtsCode }}>
      {children}
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
