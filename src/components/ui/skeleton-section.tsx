import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonRow } from "@/components/ui/skeleton-row";
import { Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export function SkeletonSection() {
  return (
    <View style={styles.section}>
      <Skeleton width={150} height={24} style={styles.sectionTitle} />
      <View style={styles.sectionRows}>
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: Spacing.four },
  sectionTitle: { marginBottom: Spacing.two },
  sectionRows: { gap: Spacing.three },
});
