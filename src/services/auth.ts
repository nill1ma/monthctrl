import { supabase } from "@/lib/supabase";

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

export async function logout(): Promise<AuthResult> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return {};
}

export async function signInWithGoogle(): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}
