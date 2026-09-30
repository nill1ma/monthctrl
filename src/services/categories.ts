import { getAuthenticatedUserId, supabase } from "@/lib/supabase";

export async function getCategories(type: "incoming" | "expense") {
  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("type", type)
    .or(`user_id.is.null,user_id.eq.${userId}`);
  // .order("name");

  if (error) throw new Error(error.message);

  console.log("Categorieeesss:  ", data);
  return data;
}
