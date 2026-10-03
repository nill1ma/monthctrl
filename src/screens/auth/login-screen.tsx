import { Colors } from "@/constants/theme";
import { AuthForm } from "@/screens/auth/auth-form";
import { login } from "@/services/auth";
import { Link } from "expo-router";
import { useIntl } from "react-intl";
import { Text, useColorScheme } from "react-native";

export default function LoginScreen() {
  const { formatMessage } = useIntl();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <AuthForm
      title={formatMessage({ id: "login.welcome" })}
      emailPlaceholder={formatMessage({ id: "login.emailPlaceholder" })}
      passwordPlaceholder={formatMessage({ id: "login.passwordPlaceholder" })}
      submitLabel={formatMessage({ id: "login.loginButton" })}
      submitLabelLoading={formatMessage({ id: "login.loggingIn" })}
      onSubmit={login}
    >
      <Link href="/signup">
        <Text>{formatMessage({ id: "login.signupLink.message" })} </Text>
        <Text
          style={{
            color: colorScheme === "dark" ? "#208AEF" : "#0066CC",
            fontWeight: "bold",
          }}
        >
          {formatMessage({ id: "login.signupLink" })}
        </Text>
      </Link>
    </AuthForm>
  );
}
