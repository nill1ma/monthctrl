import * as Localization from "expo-localization";
import { createContext, useContext, useState } from "react";

export type Locale = "en" | "es-ES";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

function detectLocale(): Locale {
  try {
    const deviceLanguage = Localization.getLocales()[0]?.languageCode;
    return deviceLanguage === "es" ? "es-ES" : "en";
  } catch (error) {
    console.error("Error detecting locale:", error);
    return "en";
  }
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale());

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context)
    throw new Error("useLocale deve ser usado dentro de LocaleProvider");
  return context;
}
