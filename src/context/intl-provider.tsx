import { useLocale } from "@/context/locale";
import { en } from "@/i18n/en";
import { es } from "@/i18n/es-ES";
import { IntlProvider } from "react-intl";

const messages: Record<string, Record<string, string>> = {
  en: en,
  "es-ES": es,
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
