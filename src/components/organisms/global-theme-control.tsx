import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/hooks/use-theme";

export function GlobalThemeControl() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { formatMessage } = useIntl();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <View style={[styles.iconWrapper, { top: insets.top + 8 }]}>
        <Pressable
          onPress={() => setVisible(true)}
          hitSlop={8}
          accessibilityLabel={formatMessage({ id: "settings.open" })}
          accessibilityHint={formatMessage({ id: "settings.openHint" })}
        >
          <Ionicons name="settings-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
          <Pressable
            style={[styles.card, { backgroundColor: colors.backgroundElement }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              {formatMessage({ id: "settings.title" })}
            </Text>

            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.text }]}>
                {formatMessage({ id: "settings.theme" })}
              </Text>
              <ThemeToggle />
            </View>

            <View style={styles.row}>
              <Text style={[styles.label, { color: colors.text }]}>
                {formatMessage({ id: "settings.language" })}
              </Text>
              <LanguageToggle />
            </View>

            <Pressable
              style={[
                styles.closeButton,
                { backgroundColor: colors.backgroundElement },
              ]}
              onPress={() => setVisible(false)}
            >
              <Text style={{ color: colors.text }}>
                {formatMessage({ id: "settings.close" })}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    position: "absolute",
    right: 12,
    zIndex: 10,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "85%",
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
  },
  closeButton: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
