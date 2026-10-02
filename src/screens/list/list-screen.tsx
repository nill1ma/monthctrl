import { Spacing } from "@/constants/theme";
import { useLocale } from "@/context/locale";
import { useListTransactions } from "@/hooks/use-list-transactions";
import { useTheme } from "@/hooks/use-theme";
import { groupByReference } from "@/utils/group-transactions";
import { Link } from "expo-router";
import { useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function List() {
  const { formatMessage, formatNumber } = useIntl();
  const { locale } = useLocale();
  const colors = useTheme();
  const {
    references,
    transactions,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useListTransactions();

  const grouped = useMemo(() => groupByReference(transactions), [transactions]);

  const onEndReachedCalledDuringMomentum = useRef(true);

  const totalIncoming = transactions.reduce(
    (sum, t) => sum + t.incoming_value,
    0,
  );
  const totalExpense = transactions.reduce(
    (sum, t) => sum + t.expense_value,
    0,
  );
  const totalNet = transactions.reduce((sum, t) => sum + t.net_income, 0);

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

  return (
    <View
      style={StyleSheet.flatten([
        styles.container,
        { backgroundColor: colors.background },
      ])}
    >
      {/* Header com botão de logout */}
      <View
        style={StyleSheet.flatten([
          styles.header,
          { borderBottomColor: colors.backgroundElement },
        ])}
      >
        <Text
          style={StyleSheet.flatten([
            styles.headerTitle,
            { color: colors.text },
          ])}
        >
          {formatMessage({ id: "list.title" })}
        </Text>
      </View>

      {/* Resumo */}
      <View
        style={StyleSheet.flatten([
          styles.summary,
          { backgroundColor: colors.backgroundElement },
        ])}
      >
        <View style={styles.summaryItem}>
          <Text
            style={StyleSheet.flatten([
              styles.summaryLabel,
              { color: colors.textSecondary },
            ])}
          >
            {formatMessage({ id: "list.incoming" })}
          </Text>
          <Text
            style={StyleSheet.flatten([
              styles.summaryValue,
              { color: "#10B981" },
            ])}
          >
            {formatCurrency(totalIncoming)}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <View style={styles.summaryItem}>
            <Text
              style={StyleSheet.flatten([
                styles.summaryLabel,
                { color: colors.textSecondary },
              ])}
            >
              {formatMessage({ id: "list.expense" })}
            </Text>
            <Text
              style={StyleSheet.flatten([
                styles.summaryValue,
                { color: "#EF4444" },
              ])}
            >
              {formatCurrency(totalExpense)}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text
              style={StyleSheet.flatten([
                styles.summaryLabel,
                { color: colors.textSecondary },
              ])}
            >
              {formatMessage({ id: "list.balance" })}
            </Text>
            <Text
              style={StyleSheet.flatten([
                styles.summaryValue,
                { color: totalNet >= 0 ? "#10B981" : "#EF4444" },
              ])}
            >
              {formatCurrency(totalNet)}
            </Text>
          </View>
        </View>
      </View>

      {/* Lista de transações */}
      <FlatList
        data={grouped}
        keyExtractor={(item) => item.reference}
        contentContainerStyle={styles.listContent}
        // onMomentumScrollBegin={() => {
        //   onEndReachedCalledDuringMomentum.current = false;
        // }}
        onScrollBeginDrag={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        onEndReached={() => {
          if (
            hasNextPage &&
            !isFetchingNextPage &&
            !onEndReachedCalledDuringMomentum.current
          ) {
            fetchNextPage();
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <Link href={`/details/${item.reference}`} asChild>
            <Pressable
              style={StyleSheet.flatten([
                styles.row,
                {
                  backgroundColor: colors.backgroundElement,
                  borderBottomColor: colors.backgroundSelected,
                },
              ])}
            >
              <View style={styles.rowHeader}>
                <Text
                  style={StyleSheet.flatten([
                    styles.reference,
                    { color: colors.text },
                  ])}
                >
                  {item.reference}
                </Text>
                <Text
                  style={StyleSheet.flatten([
                    styles.netIncome,
                    { color: item.net_income >= 0 ? "#10B981" : "#EF4444" },
                  ])}
                >
                  {formatCurrency(item.net_income)}
                </Text>
              </View>
              <View style={styles.rowDetails}>
                <View style={styles.detailItem}>
                  <Text
                    style={StyleSheet.flatten([
                      styles.detailLabel,
                      { color: colors.textSecondary },
                    ])}
                  >
                    {formatMessage({ id: "list.incoming" })}
                  </Text>
                  <Text
                    style={StyleSheet.flatten([
                      styles.detailValue,
                      { color: "#10B981" },
                    ])}
                  >
                    {formatCurrency(item.incoming_value)}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Text
                    style={StyleSheet.flatten([
                      styles.detailLabel,
                      { color: colors.textSecondary },
                    ])}
                  >
                    {formatMessage({ id: "list.expense" })}
                  </Text>
                  <Text
                    style={StyleSheet.flatten([
                      styles.detailValue,
                      { color: "#EF4444" },
                    ])}
                  >
                    {formatCurrency(item.expense_value)}
                  </Text>
                </View>
              </View>
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.text} />
            ) : (
              <Text
                style={StyleSheet.flatten([
                  styles.emptyText,
                  { color: colors.textSecondary },
                ])}
              >
                {formatMessage({ id: "list.empty" })}
              </Text>
            )}
          </View>
        }
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color={colors.text} />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoutButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: "#EF4444",
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: Spacing.four,
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    borderRadius: 12,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: Spacing.one,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContent: {
    padding: Spacing.three,
  },
  row: {
    padding: Spacing.four,
    borderRadius: 12,
    marginBottom: Spacing.three,
    borderBottomWidth: 1,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  reference: {
    fontSize: 16,
    fontWeight: "600",
  },
  netIncome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rowDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: Spacing.half,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.six,
  },
  emptyText: {
    fontSize: 16,
  },
  loadingFooter: {
    paddingVertical: Spacing.four,
    alignItems: "center",
  },
});
