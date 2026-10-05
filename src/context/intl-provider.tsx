import { useLocale } from "@/context/locale";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es-ES";
import { pt } from "@/i18n/pt-BR";
import { IntlProvider } from "react-intl";

const messages: Record<string, Record<string, string>> = {
  en: en,
  "es-ES": es,
  "pt-BR": pt,
};

export function I18Provider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();

  return (
    <IntlProvider
      locale={locale}
      messages={messages[locale]}
      defaultLocale="en"
      onError={(error) => {
        console.error("IntlProvider error:", error);
      }}
    >
      {children}
    </IntlProvider>
  );
}
