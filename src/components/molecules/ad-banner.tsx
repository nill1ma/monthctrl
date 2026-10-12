import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import {
    BannerAd,
    BannerAdSize,
    TestIds,
} from "react-native-google-mobile-ads";

const IS_DEV = __DEV__;

interface AdBannerProps {
  adUnitId: string;
}

export function AdBanner({ adUnitId }: AdBannerProps) {
  const colors = useTheme();
  const unitId = IS_DEV ? TestIds.BANNER : adUnitId;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: Spacing.one,
  },
});
