import { useRouter } from "expo-router";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Spacing } from "@/constants/theme";
import { useExportMenuPdf } from "@/hooks/use-export-menu-pdf";
import { useProfile } from "@/hooks/use-profile";
import { useTheme } from "@/hooks/use-theme";
import { logout } from "@/services/auth";
import { LanguageToggle } from "../ui/language-toggle";
import { ExportPdfModal } from "./export-pdf-modal";

const DRAWER_WIDTH = 240;

const LINKS = [
  { labelId: "list.drawer.transactions", href: "/" },
  { labelId: "list.drawer.create.incoming", href: "/incomings/create" },
  { labelId: "list.drawer.create.expense", href: "/expenses/create" },
  { labelId: "list.drawer.profile", href: "/profile/profile" },
] as const;

export function SideDrawer() {
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);
  const colors = useTheme();
  const router = useRouter();
  const progress = useSharedValue(0);
  const { profile } = useProfile();
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const { exportPdf, isExporting } = useExportMenuPdf();

  function toggle() {
    const next = !open;
    setOpen(next);
    progress.value = withTiming(next ? 1 : 0, { duration: 250 });
  }

  function handleNavigate(href: (typeof LINKS)[number]["href"]) {
    toggle();
    router.push(href);
  }

  async function handleLogout() {
    toggle();
    await logout();
  }

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -DRAWER_WIDTH + progress.value * DRAWER_WIDTH }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value * 0.4,
    pointerEvents: open ? "auto" : "none",
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));

  return (
    <>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={toggle} />
      </Animated.View>

      <Animated.View style={[styles.panel, panelStyle]}>
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <View
            style={[
              styles.profileSection,
              { borderBottomColor: colors.backgroundSelected },
            ]}
          >
            <Text style={[styles.profileName, { color: colors.text }]}>
              {profile?.name ?? profile?.nickname ?? "—"}
            </Text>
            <Text
              style={[styles.profileCurrency, { color: colors.textSecondary }]}
            >
              {profile?.preferred_currency ?? ""}
            </Text>
          </View>

          {LINKS.map((link) => (
            <Pressable
              key={link.href}
              style={[
                styles.linkRow,
                { borderBottomColor: colors.backgroundSelected },
              ]}
              onPress={() => handleNavigate(link.href)}
            >
              <Text style={[styles.linkText, { color: colors.text }]}>
                {formatMessage({ id: link.labelId })}
              </Text>
            </Pressable>
          ))}
          <Pressable
            style={[
              styles.linkRow,
              { borderBottomColor: colors.backgroundSelected },
            ]}
            onPress={() => {
              toggle();
              setExportModalVisible(true);
            }}
          >
            <Text style={[styles.linkText, { color: colors.text }]}>
              {formatMessage({ id: "export.drawer.link" })}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.linkRow,
              { borderBottomColor: colors.backgroundSelected },
            ]}
            onPress={handleLogout}
          >
            <Text
              style={[styles.linkText, styles.logoutText, { color: "#EF4444" }]}
            >
              {formatMessage({ id: "list.drawer.logout" })}
            </Text>
          </Pressable>

          <View style={styles.themeToggleWrapper}>
            <LanguageToggle />
            <ThemeToggle />
          </View>
        </View>

        <Pressable
          style={[styles.handle, { backgroundColor: colors.background }]}
          onPress={toggle}
        >
          <Animated.Text
            style={[styles.arrow, arrowStyle, { color: colors.text }]}
          >
            ›
          </Animated.Text>
        </Pressable>
      </Animated.View>
      <ExportPdfModal
        visible={exportModalVisible}
        onClose={() => setExportModalVisible(false)}
        onExport={exportPdf}
      />
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: DRAWER_WIDTH,
    flexDirection: "row",
  },
  content: {
    flex: 1,
    paddingTop: Spacing.six,
    paddingHorizontal: Spacing.five,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.six,
  },
  linkRow: {
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
  },
  linkText: {
    fontSize: 16,
  },
  logoutText: {
    fontWeight: "600",
  },
  themeToggleWrapper: {
    marginTop: Spacing.four,
    gap: Spacing.two,
  },
  handle: {
    position: "absolute",
    right: -28,
    top: "45%",
    width: 28,
    height: 56,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 8,
  },
  arrow: {
    fontSize: 22,
  },
  profileSection: {
    marginBottom: Spacing.four,
    paddingBottom: Spacing.four,
    borderBottomWidth: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
  },
  profileCurrency: {
    fontSize: 13,
    marginTop: 2,
  },
});
