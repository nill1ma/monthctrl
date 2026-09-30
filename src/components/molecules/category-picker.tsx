import { Picker } from "@react-native-picker/picker";
import { useQuery } from "@tanstack/react-query";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { getCategories } from "@/services/categories";

type CategoryPickerProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  type: "incoming" | "expense";
  label: string;
  error?: string;
};

export function CategoryPicker<TFieldValues extends FieldValues>({
  control,
  name,
  type,
  label,
  error,
}: CategoryPickerProps<TFieldValues>) {
  const colors = useTheme();
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories", type],
    queryFn: () => getCategories(type),
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.container}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          <View
            style={[
              styles.pickerWrapper,
              { backgroundColor: colors.backgroundElement },
            ]}
          >
            <Picker
              selectedValue={value ?? ""}
              onValueChange={onChange}
              style={{ color: colors.text }}
              //   dropdownIconColor={colors.text}
            >
              {categories?.map((category) => (
                <Picker.Item
                  key={category.id}
                  label={category.name}
                  value={category.id}
                  style={{
                    color: colors.text,
                    backgroundColor: colors.backgroundElement,
                  }}
                />
              ))}
            </Picker>
          </View>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 4, fontWeight: "500" },
  pickerWrapper: { borderRadius: 8, overflow: "hidden" },
  error: { color: "red", fontSize: 12, marginTop: 4 },
});
