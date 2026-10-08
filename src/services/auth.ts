import { upsertProfile } from "@/db/seeds/queries/profiles";
import { supabase } from "@/lib/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

type AuthResult = { error?: string };

export async function login(
  email: string,
  password: string,
): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}

export async function signup(
  email: string,
  password: string,
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { error: error.message };

  if (data.user) {
    upsertProfile(data.user.id, {});
  }

  return {};
}

export async function logout(): Promise<AuthResult> {
  await GoogleSignin.signOut();
  const { error } = await supabase.auth.signOut();
  if (error) return { error: error.message };
  return {};
}

export async function signInWithGoogle(): Promise<AuthResult> {
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  if (!response.data?.idToken) {
    return { error: "No ID token returned" };
  }
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.data.idToken,
  });
  if (error) return { error: error.message };

  if (data.user) {
    upsertProfile(data.user.id, {});
  }
  return {};
}

export async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<AuthResult> {
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInError) return { error: "Current password is incorrect" };

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) return { error: updateError.message };

  return {};
}
export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "monthctrl://reset-password",
  });
  if (error) throw error;
}
export async function resetPassword(newPassword: string): Promise<AuthResult> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return {};
}
