
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export const availableLanguages = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "sw", label: "Swahili" },
  { value: "lin", label: "Lingala" },
  { value: "es", label: "Spanish" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Mandarin Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
];

export interface LanguageContextType {
  spokenLanguage: string;
  setSpokenLanguage: (lang: string) => void;
  learningLanguage: string;
  setLearningLanguage: (lang: string) => void;
  getLanguageLabel: (value: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [spokenLanguage, setSpokenLanguageState] = useState<string>("en");
  const [learningLanguage, setLearningLanguageState] = useState<string>("fr");

  // Persist language preferences to localStorage
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
  }
  
  return (
    <LanguageContext.Provider value={{ spokenLanguage, setSpokenLanguage, learningLanguage, setLearningLanguage, getLanguageLabel }}>
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
