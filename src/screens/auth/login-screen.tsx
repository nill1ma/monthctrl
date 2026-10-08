import { useTheme } from "@/hooks/use-theme";
import { AuthForm } from "@/screens/auth/auth-form";
import { login } from "@/services/auth";
import { Link } from "expo-router";
import { useIntl } from "react-intl";
import { Text } from "react-native";

export default function LoginScreen() {
  const { formatMessage } = useIntl();
  const colors = useTheme();

  return (
    <AuthForm
      title={formatMessage({ id: "login.welcome" })}
      emailPlaceholder={formatMessage({ id: "login.emailPlaceholder" })}
      passwordPlaceholder={formatMessage({ id: "login.passwordPlaceholder" })}
      submitLabel={formatMessage({ id: "login.loginButton" })}
      submitLabelLoading={formatMessage({ id: "login.loggingIn" })}
      onSubmit={login}
      footer={
        <Link href="/forgot-password">
          <Text style={{ color: "#208AEF" }}>
            {formatMessage({ id: "forgotPassword.link" })}
          </Text>
        </Link>
      }
    >
      <Link href="/signup">
        <Text style={{ color: colors.text }}>
          {formatMessage({ id: "login.signupLink.message" })}{" "}
        </Text>
        <Text
          style={{
            color: "#208AEF",
            fontWeight: "bold",
          }}
        >
          {formatMessage({ id: "login.signupLink" })}
        </Text>
      </Link>
    </AuthForm>
  );
}
