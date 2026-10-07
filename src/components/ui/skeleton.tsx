import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";

export function Skeleton({
  width,
  height,
  style,
}: {
  width?: number | string;
  height?: number | string;
  style?: any;
}) {
  const colors = useTheme();
  return (
    <View
      style={[
        styles.skeleton,
        { backgroundColor: colors.backgroundSelected },
        width && { width },
        height && { height },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 4,
  },
});
