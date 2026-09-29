import { Colors } from "@/constants/theme";
import { useAppTheme } from "@/context/theme";

export function useTheme() {
  const { scheme } = useAppTheme();
  return Colors[scheme];
}
