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
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  return {};
}

// export async function logout(): Promise<AuthResult> {
//   const { error } = await supabase.auth.signOut();

//   if (error) {
//     return { error: error.message };
//   }

//   return {};
// }

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
  const { error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: response.data.idToken,
  });
  if (error) return { error: error.message };
  return {};
}
