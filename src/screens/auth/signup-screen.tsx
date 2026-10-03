import { Colors } from "@/constants/theme";
import { AuthForm } from "@/screens/auth/auth-form";
import { signup } from "@/services/auth";
import { Link } from "expo-router";
import { useIntl } from "react-intl";
import { Text, useColorScheme } from "react-native";

export default function SignupScreen() {
  const { formatMessage } = useIntl();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <AuthForm
      title={formatMessage({ id: "signup.welcome" })}
      emailPlaceholder={formatMessage({ id: "login.emailPlaceholder" })}
      passwordPlaceholder={formatMessage({ id: "login.passwordPlaceholder" })}
      submitLabel={formatMessage({ id: "login.createAccountButton" })}
      submitLabelLoading={formatMessage({ id: "signup.creatingAccount" })}
      onSubmit={signup}
    >
      <Link href="/login">
        <Text>{formatMessage({ id: "signup.alreadyHaveAccount" })} </Text>
        <Text
          style={{
            color: colorScheme === "dark" ? "#208AEF" : "#0066CC",
            fontWeight: "bold",
          }}
        >
          {formatMessage({ id: "signup.loginLink" })}
        </Text>
      </Link>
    </AuthForm>
  );
}
