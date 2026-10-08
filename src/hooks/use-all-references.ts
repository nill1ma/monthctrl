import { useAuth } from "@/context/auth";
import { getAllDistinctReferences } from "@/services/list";
import { useQuery } from "@tanstack/react-query";

export function useAllReferences() {
  const { session } = useAuth();

  const { data: references = [] } = useQuery({
    queryKey: ["references", "all", session?.user.id],
    queryFn: () => getAllDistinctReferences(session!.user.id),
    enabled: !!session?.user.id,
  });

  return { references };
}
