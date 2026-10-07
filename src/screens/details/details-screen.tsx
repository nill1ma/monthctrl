import { SwipeableRow } from "@/components/molecules/swipeable-row";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonSection } from "@/components/ui/skeleton-section";
import { Spacing } from "@/constants/theme";
import { useDetailsTransactions } from "@/hooks/use-details-transactions";
import { useExpenses } from "@/hooks/use-expenses";
import { useIncomings } from "@/hooks/use-incomings";
import { useTheme } from "@/hooks/use-theme";
import { formatCurrency, getCurrencyFlag } from "@/lib/currency";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import {
  Alert,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
type TransactionType = "incomings" | "expenses";

type Row = {
  id: string;
  label: string;
  value: number;
  currency: string;
  type: TransactionType;
};

type Section = {
  title: string;
  currency: string;
  data: Row[];
};

function groupByCurrency(
  items: {
    id: string;
    value: number;
    currency: string;
    label: string;
    type: TransactionType;
  }[],
  sectionLabel: string,
): Section[] {
  const groups = new Map<string, Row[]>();

  for (const item of items) {
    const existing = groups.get(item.currency) ?? [];
    existing.push({
      id: item.id,
      label: item.label,
      value: item.value,
      currency: item.currency,
      type: item.type,
    });
    groups.set(item.currency, existing);
  }

  return Array.from(groups.entries()).map(([currency, data]) => ({
    title: `${sectionLabel} ${getCurrencyFlag(currency)} ${currency}`,
    currency,
    data,
  }));
}

export default function DetailsScreen() {
  const colors = useTheme();
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { reference, incomings, expenses, isLoading, isError } =
    useDetailsTransactions();
  const { deleteMutation: deleteIncoming, deleteIncomingsByReferenceMutate } =
    useIncomings();
  const { deleteMutation: deleteExpense, deleteExpensesByReferenceMutate } =
    useExpenses();

  useEffect(() => {
    if (isLoading) return;
    const hasData =
      (incomings && incomings.length > 0) || (expenses && expenses.length > 0);

    if (!hasData && !isLoading) {
      router.replace("/");
    }
  }, [incomings, expenses, isLoading]);

  function handlePressItem(id: string, type: TransactionType) {
    router.push({
      pathname: `/${type}/edit/[id]`,
      params: { id },
    });
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Skeleton width={150} height={32} style={styles.title} />
        <SkeletonSection />
        <SkeletonSection />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          {formatMessage({ id: "details.error" })}
        </Text>
      </View>
    );
  }

  const incomingSections = groupByCurrency(
    (incomings ?? []).map((item) => ({
      id: item.id,
      value: item.value ?? 0,
      currency: item.currency,
      label: item.origin,
      type: "incomings" as const,
    })),
    formatMessage({ id: "details.incomings" }),
  );

  const expenseSections = groupByCurrency(
    (expenses ?? []).map((item) => ({
      id: item.id,
      value: item.value ?? 0,
      currency: item.currency,
      label: item.destination,
      type: "expenses" as const,
    })),
    formatMessage({ id: "details.expenses" }),
  );

  const sections = [...incomingSections, ...expenseSections];

  function handleDeleteItem(id: string, type: TransactionType) {
    Alert.alert(
      formatMessage({ id: "details.delete.title" }),
      formatMessage({ id: "details.delete.message" }),
      [
        { text: formatMessage({ id: "login.cancel" }), style: "cancel" },
        {
          text: formatMessage({ id: "details.delete.confirm" }),
          style: "destructive",
          onPress: async () => {
            if (type === "incomings") {
              await deleteIncoming(id);
            } else {
              await deleteExpense(id);
            }
          },
        },
      ],
    );
  }

  function handleDeleteAll() {
    Alert.alert(
      formatMessage({ id: "details.deleteAll.title" }),
      formatMessage({ id: "details.deleteAll.message" }, { reference }),
      [
        { text: formatMessage({ id: "login.cancel" }), style: "cancel" },
        {
          text: formatMessage({ id: "details.delete.confirm" }),
          style: "destructive",
          onPress: () => {
            deleteIncomingsByReferenceMutate(reference!);
            deleteExpensesByReferenceMutate(reference!);
          },
        },
      ],
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: reference ?? "",
          headerRight: () => (
            <Pressable
              onPress={handleDeleteAll}
              hitSlop={8}
              accessibilityLabel={formatMessage({
                id: "details.deleteAll.label",
              })}
            >
              <Ionicons name="trash-outline" size={22} color="#EF4444" />
            </Pressable>
          ),
        }}
      />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <SwipeableRow
            onEdit={() => handlePressItem(item.id, item.type)}
            onDelete={() => handleDeleteItem(item.id, item.type)}
          >
            <Pressable
              onPress={() => handlePressItem(item.id, item.type)}
              android_ripple={{ color: colors.backgroundSelected }}
              style={({ pressed }) => [
                styles.row,
                {
                  backgroundColor: pressed
                    ? colors.backgroundSelected
                    : colors.backgroundElement,
                  borderBottomColor: colors.backgroundSelected,
                },
              ]}
            >
              <Text style={[styles.label, { color: colors.text }]}>
                {item.label}
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {formatCurrency(item.value, item.currency)}
              </Text>
            </Pressable>
          </SwipeableRow>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {section.title}
          </Text>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  title: { fontSize: 24, fontWeight: "600" },
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
