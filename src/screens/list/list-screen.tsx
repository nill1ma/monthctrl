import { CurrencySelect } from "@/components/molecules/currency-select";
import { Colors, Spacing } from "@/constants/theme";
import { useCurrencyTotals } from "@/hooks/use-currency-totals";
import { useExchangeRates } from "@/hooks/use-exchange-rates";
import { useListTransactions } from "@/hooks/use-list-transactions";
import { formatCurrency, getCurrencyFlag } from "@/lib/currency";
import {
  getConvertedBalance,
  groupTransactionsByReference,
} from "@/lib/transactions";
import { logout } from "@/services/auth";
import { Link } from "expo-router";
import { useState } from "react";
import { useIntl } from "react-intl";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function List() {
  const [loading, setLoading] = useState(false);
  const [convertEnabled, setConvertEnabled] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme === "dark" ? "dark" : "light"];
  const { formatMessage } = useIntl();

  const { transactions, isLoading, fetchNextPage, hasNextPage } =
    useListTransactions();
  const { data: currencyTotals = [] } = useCurrencyTotals();

  const availableCurrencies = currencyTotals.map((t) => t.currency);
  const [displayCurrency, setDisplayCurrency] = useState(
    availableCurrencies[0] ?? "BRL",
  );

  const otherCurrencies = availableCurrencies.filter(
    (c) => c !== displayCurrency,
  );
  const { data: rates, isLoading: ratesLoading } = useExchangeRates(
    displayCurrency,
    convertEnabled ? otherCurrencies : [],
  );

  const referenceGroups = groupTransactionsByReference(transactions);
  const hasMultipleCurrencies = availableCurrencies.length > 1;

  async function handleSubmit() {
    setLoading(true);
    await logout();
    setLoading(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.header, { borderBottomColor: colors.backgroundElement }]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {formatMessage({ id: "list.title" })}
        </Text>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>
            {formatMessage({ id: "list.logout" })}
          </Text>
        </TouchableOpacity>
      </View>

      {hasMultipleCurrencies && (
        <View
          style={[
            styles.convertBar,
            { backgroundColor: colors.backgroundElement },
          ]}
        >
          <View style={styles.convertToggleRow}>
            <Text style={[styles.convertLabel, { color: colors.text }]}>
              {formatMessage({ id: "list.convert.toggle" })}
            </Text>
            <Switch value={convertEnabled} onValueChange={setConvertEnabled} />
          </View>
          {convertEnabled && (
            <CurrencySelect
              value={displayCurrency}
              onChange={setDisplayCurrency}
              options={availableCurrencies}
            />
          )}
        </View>
      )}

      <FlatList
        data={referenceGroups}
        keyExtractor={(group) => group.reference}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: group }) => {
          const converted =
            convertEnabled && rates
              ? getConvertedBalance(group, displayCurrency, rates)
              : null;

          return (
            <Link href={`/details/${group.reference}`} asChild>
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
                  <Text style={[styles.reference, { color: colors.text }]}>
                    {group.reference}
                  </Text>
                </View>

                {convertEnabled ? (
                  ratesLoading || !converted ? (
                    <ActivityIndicator size="small" color={colors.text} />
                  ) : (
                    <Text
                      style={[
                        styles.netIncome,
                        { color: converted.net >= 0 ? "#10B981" : "#EF4444" },
                      ]}
                    >
                      {formatMessage({ id: "list.balance" })}: ≈{" "}
                      {formatCurrency(converted.net, displayCurrency)}
                    </Text>
                  )
                ) : (
                  group.currencies.map((entry) => (
                    <View key={entry.currency} style={styles.currencyRow}>
                      <Text
                        style={[
                          styles.currencyLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {getCurrencyFlag(entry.currency)} {entry.currency}
                      </Text>
                      <View style={styles.rowDetails}>
                        <Text
                          style={[styles.detailValue, { color: "#10B981" }]}
                        >
                          {formatCurrency(entry.incoming_value, entry.currency)}
                        </Text>
                        <Text
                          style={[styles.detailValue, { color: "#EF4444" }]}
                        >
                          {formatCurrency(entry.expense_value, entry.currency)}
                        </Text>
                        <Text
                          style={[
                            styles.detailValue,
                            {
                              color:
                                entry.net_income >= 0 ? "#10B981" : "#EF4444",
                              fontWeight: "700",
                            },
                          ]}
                        >
                          {formatCurrency(entry.net_income, entry.currency)}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </Pressable>
            </Link>
          );
        }}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.text} />
            ) : (
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
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
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  logoutButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: "#EF4444",
    borderRadius: 8,
  },
  logoutButtonText: { color: "white", fontWeight: "600", fontSize: 14 },
  convertBar: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.two,
  },
  convertToggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  convertLabel: { fontSize: 14, fontWeight: "500" },
  listContent: { padding: Spacing.three },
  row: {
    padding: Spacing.four,
    borderRadius: 12,
    marginBottom: Spacing.three,
    borderBottomWidth: 1,
    gap: Spacing.two,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reference: { fontSize: 16, fontWeight: "600" },
  netIncome: { fontSize: 18, fontWeight: "bold" },
  currencyRow: { gap: Spacing.half },
  currencyLabel: { fontSize: 12 },
  rowDetails: { flexDirection: "row", justifyContent: "space-between" },
  detailValue: { fontSize: 14, fontWeight: "600" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.six,
  },
  emptyText: { fontSize: 16 },
  loadingFooter: { paddingVertical: Spacing.four, alignItems: "center" },
});
