import { Skeleton } from "@/components/ui/skeleton";
import { Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export function SkeletonRow() {
  return (
    <View style={styles.row}>
      <Skeleton width={100} height={20} />
      <View style={styles.rowDetails}>
        <Skeleton width={60} height={16} />
        <Skeleton width={60} height={16} />
        <Skeleton width={60} height={16} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: Spacing.four,
    borderRadius: 12,
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  rowDetails: { flexDirection: "row", justifyContent: "space-between" },
});
