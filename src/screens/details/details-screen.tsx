import { Colors, Spacing } from "@/constants/theme";
import { useDetailsTransactions } from "@/hooks/use-details-transactions";
import {
    ActivityIndicator,
    SectionList,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";

type Section = {
  title: string;
  data: { id: string; label: string; value: number }[];
};

export default function DetailsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const { reference, incomings, expenses, isLoading, isError } =
    useDetailsTransactions();

  if (isLoading) {
    return (
      <View
        style={StyleSheet.flatten([
          styles.center,
          { backgroundColor: colors.background },
        ])}
      >
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={StyleSheet.flatten([
          styles.center,
          { backgroundColor: colors.background },
        ])}
      >
        <Text
          style={StyleSheet.flatten([
            styles.errorText,
            { color: colors.textSecondary },
          ])}
        >
          Não foi possível carregar os detalhes.
        </Text>
      </View>
    );
  }

  const sections: Section[] = [
    {
      title: "Incomings",
      data:
        incomings?.map((item) => ({
          id: item.id,
          label: item.origin,
          value: item.value || 0,
        })) || [],
    },
    {
      title: "Expenses",
      data:
        expenses?.map((item) => ({
          id: item.id,
          label: item.destination,
          value: item.value,
        })) || [],
    },
  ];

  const formatCurrency = (value: number) => `R$ ${value.toFixed(2)}`;

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        { backgroundColor: colors.background },
      ])}
    >
      <Text style={StyleSheet.flatten([styles.title, { color: colors.text }])}>
        {reference}
      </Text>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View
            style={StyleSheet.flatten([
              styles.row,
              {
                backgroundColor: colors.backgroundElement,
                borderBottomColor: colors.backgroundSelected,
              },
            ])}
          >
            <Text
              style={StyleSheet.flatten([styles.label, { color: colors.text }])}
            >
              {item.label}
            </Text>
            <Text
              style={StyleSheet.flatten([styles.value, { color: colors.text }])}
            >
              {formatCurrency(item.value)}
            </Text>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Text
            style={StyleSheet.flatten([
              styles.sectionTitle,
              { color: colors.text },
            ])}
          >
            {section.title}
          </Text>
        )}
        ListEmptyComponent={
          <Text
            style={StyleSheet.flatten([
              styles.empty,
              { color: colors.textSecondary },
            ])}
          >
            Nenhum dado encontrado.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.four },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16 },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: Spacing.four,
  },
  listContent: { gap: Spacing.three },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  label: { fontSize: 16 },
  value: { fontSize: 16, fontWeight: "600" },
  empty: { fontSize: 16, textAlign: "center", marginTop: Spacing.six },
});
