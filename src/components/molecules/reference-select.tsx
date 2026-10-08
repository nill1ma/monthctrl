import { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface ReferenceSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  label: string;
}

export function ReferenceSelect({
  value,
  options,
  onChange,
  label,
}: ReferenceSelectProps) {
  const colors = useTheme();
  const [open, setOpen] = useState(false);

  function handleSelect(ref: string) {
    onChange(ref);
    setOpen(false);
  }

  return (
    <>
      <View style={styles.wrapper}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
        <Pressable
          style={[
            styles.trigger,
            {
              borderColor: colors.backgroundSelected,
              backgroundColor: colors.backgroundSelected,
            },
          ]}
          onPress={() => setOpen(true)}
        >
          <Text style={[styles.triggerText, { color: colors.text }]}>
            {value || "—"}
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        <View style={[styles.dropdown, { backgroundColor: colors.background }]}>
          <ScrollView>
            {options.map((ref) => (
              <Pressable
                key={ref}
                style={[
                  styles.option,
                  { borderBottomColor: colors.backgroundSelected },
                  ref === value && {
                    backgroundColor: colors.backgroundSelected,
                  },
                ]}
                onPress={() => handleSelect(ref)}
              >
                <Text style={[styles.optionText, { color: colors.text }]}>
                  {ref}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: Spacing.one,
  },
  label: {
    fontSize: 12,
  },
  trigger: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 8,
    borderWidth: 1,
  },
  triggerText: {
    fontSize: 14,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  dropdown: {
    position: "absolute",
    left: Spacing.five,
    right: Spacing.five,
    top: "30%",
    maxHeight: 300,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  option: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 15,
  },
});
