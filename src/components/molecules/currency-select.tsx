import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";

type CurrencySelectProps = {
  value: string;
  onChange: (currency: string) => void;
  options: string[];
};

export function CurrencySelect({
  value,
  onChange,
  options,
}: CurrencySelectProps) {
  const colors = useTheme();

  return (
    <View
      style={[styles.wrapper, { backgroundColor: colors.backgroundElement }]}
    >
      <Picker
        selectedValue={value}
        onValueChange={onChange}
        style={{ color: colors.text }}
      >
        {options.map((code) => (
          <Picker.Item key={code} label={code} value={code} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { borderRadius: 8, overflow: "hidden", minWidth: 110 },
});
