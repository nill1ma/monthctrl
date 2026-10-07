import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable } from "react-native";

type InfoButtonProps = {
  title: string;
  message: string;
  cancelLabel: string;
};
export function InfoButton({ title, message, cancelLabel }: InfoButtonProps) {
  const colors = useTheme();
  return (
    <Pressable
      onPress={(e) => {
        e.stopPropagation();
        Alert.alert(title, message, [
          {
            text: cancelLabel,
            style: "cancel",
          },
        ]);
      }}
      hitSlop={8}
    >
      <Ionicons
        name="information-circle-outline"
        size={18}
        color={colors.textSecondary}
      />
    </Pressable>
  );
}
