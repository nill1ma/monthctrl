import { Spacing } from "@/constants/theme";
import { useLocale } from "@/context/locale";
import { useDetailsTransactions } from "@/hooks/use-details-transactions";
import { useTheme } from "@/hooks/use-theme";
import { useRouter } from "expo-router";
import { useIntl } from "react-intl";
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Section = {
  titleId: string;
  data: {
    id: string;
    label: string;
    value: number;
    type: "incomings" | "expenses";
  }[];
};

export default function DetailsScreen() {
  const { formatMessage, formatNumber } = useIntl();
  const { locale } = useLocale();
  const colors = useTheme();
  const { reference, incomings, expenses, isLoading, isError } =
    useDetailsTransactions();
  const router = useRouter();

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
          {formatMessage({ id: "details.error" })}
        </Text>
      </View>
    );
  }

  const sections: Section[] = [
    {
      titleId: "details.incomings",
      data:
        incomings?.map((item) => ({
          id: item.id,
          label: item.origin,
          value: item.value || 0,
          type: "incomings",
        })) || [],
    },
    {
      titleId: "details.expenses",
      data:
        expenses?.map((item) => ({
          id: item.id,
          label: item.destination,
          value: item.value,
          type: "expenses",
        })) || [],
    },
  ];

  const getCurrency = () => {
    switch (locale) {
      case "es-ES":
        return "EUR";
      case "en":
        return "USD";
      default:
        return "BRL";
    }
  };

  const formatCurrency = (value: number) => {
    return formatNumber(value, {
      style: "currency",
      currency: getCurrency(),
    });
  };

  const handlePressItem = (id: string, type: "incomings" | "expenses") => {
    router.push({
      pathname: `/${type}/edit/[id]`,
      params: { id },
    });
  };

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
          <Pressable
            onPress={() => handlePressItem(item.id, item.type)}
            android_ripple={{ color: colors.backgroundSelected }}
            style={({ pressed }) => [
              styles.row,
              {
                backgroundColor: pressed
                  ? colors.backgroundSelected
                  : colors.backgroundElement,
                // borderBottomColor: colors.backgroundSelected,
              },
            ]}
          >
            <View
              style={StyleSheet.flatten([
                styles.row,
                {
                  backgroundColor: colors.backgroundElement,
                  // borderBottomColor: colors.backgroundSelected,
                  gap: 3,
                },
              ])}
            >
              <Text
                style={StyleSheet.flatten([
                  styles.label,
                  { color: colors.text },
                ])}
              >
                {item.label}:
              </Text>
              <Text
                style={StyleSheet.flatten([
                  styles.value,
                  { color: colors.text },
                ])}
              >
                {formatCurrency(item.value)}
              </Text>
            </View>
          </Pressable>
        )}
        renderSectionHeader={({ section }) => (
          <Text
            style={StyleSheet.flatten([
              styles.sectionTitle,
              { color: colors.text },
            ])}
          >
            {formatMessage({ id: section.titleId })}
          </Text>
        )}
        ListEmptyComponent={
          <Text
            style={StyleSheet.flatten([
              styles.empty,
              { color: colors.textSecondary },
            ])}
          >
            {formatMessage({ id: "details.empty" })}
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
    borderRadius: 8,
  },
  label: { fontSize: 16 },
  value: { fontSize: 16, fontWeight: "600" },
  empty: { fontSize: 16, textAlign: "center", marginTop: Spacing.six },
});
