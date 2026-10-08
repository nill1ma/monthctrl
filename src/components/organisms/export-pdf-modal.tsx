import { useState } from "react";
import { useIntl } from "react-intl";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { ReferenceSelect } from "@/components/molecules/reference-select";
import { Spacing } from "@/constants/theme";
import { useAllReferences } from "@/hooks/use-all-references";
import { useAvailableCurrencies } from "@/hooks/use-available-currencies";
import { useTheme } from "@/hooks/use-theme";

export type TransactionType = "all" | "incoming" | "expense";

export interface ExportFilters {
  referenceStart: string;
  referenceEnd: string;
  transactionType: TransactionType;
  currencies: string[] | "all";
}

interface ExportPdfModalProps {
  visible: boolean;
  onClose: () => void;
  onExport: (filters: ExportFilters) => void;
}

export function ExportPdfModal({
  visible,
  onClose,
  onExport,
}: ExportPdfModalProps) {
  const { formatMessage } = useIntl();
  const colors = useTheme();
  const { references } = useAllReferences();

  const [referenceStart, setReferenceStart] = useState(
    references[references.length - 1] ?? "",
  );
  const [referenceEnd, setReferenceEnd] = useState(references[0] ?? "");
  const [transactionType, setTransactionType] =
    useState<TransactionType>("all");
  const [selectedCurrencies, setSelectedCurrencies] = useState<
    string[] | "all"
  >("all");

  const { currencies } = useAvailableCurrencies(referenceStart, referenceEnd);

  const TYPES: { label: string; value: TransactionType }[] = [
    { label: formatMessage({ id: "export.type.all" }), value: "all" },
    { label: formatMessage({ id: "export.type.incoming" }), value: "incoming" },
    { label: formatMessage({ id: "export.type.expense" }), value: "expense" },
  ];

  function toggleCurrency(currency: string) {
    if (selectedCurrencies === "all") {
      setSelectedCurrencies([currency]);
      return;
    }
    const next = selectedCurrencies.includes(currency)
      ? selectedCurrencies.filter((c) => c !== currency)
      : [...selectedCurrencies, currency];
    setSelectedCurrencies(next.length === 0 ? "all" : next);
  }

  function handleExport() {
    onExport({
      referenceStart,
      referenceEnd,
      transactionType,
      currencies: selectedCurrencies,
    });
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {formatMessage({ id: "export.modal.title" })}
        </Text>

        {/* Period */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {formatMessage({ id: "export.period.label" })}
        </Text>
        <View style={styles.row}>
          <ReferenceSelect
            label={formatMessage({ id: "export.period.from" })}
            value={referenceStart}
            options={references}
            onChange={setReferenceStart}
          />
          <ReferenceSelect
            label={formatMessage({ id: "export.period.to" })}
            value={referenceEnd}
            options={references}
            onChange={setReferenceEnd}
          />
        </View>

        {/* Transaction type */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {formatMessage({ id: "export.type.label" })}
        </Text>
        <View style={styles.row}>
          {TYPES.map((t) => {
            const active = transactionType === t.value;
            return (
              <Pressable
                key={t.value}
                style={[
                  styles.chip,
                  { borderColor: colors.backgroundSelected },
                  active && { backgroundColor: "#208AEF" },
                ]}
                onPress={() => setTransactionType(t.value)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: active ? "#fff" : colors.text },
                  ]}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Currency */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {formatMessage({ id: "export.currency.label" })}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.row}>
            <Pressable
              style={[
                styles.chip,
                { borderColor: colors.backgroundSelected },
                selectedCurrencies === "all" && {
                  backgroundColor: "#208AEF",
                },
              ]}
              onPress={() => setSelectedCurrencies("all")}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: selectedCurrencies === "all" ? "#fff" : colors.text,
                  },
                ]}
              >
                {formatMessage({ id: "export.currency.all" })}
              </Text>
            </Pressable>
            {currencies.map((c) => {
              const active =
                selectedCurrencies !== "all" && selectedCurrencies.includes(c);
              return (
                <Pressable
                  key={c}
                  style={[
                    styles.chip,
                    { borderColor: colors.backgroundSelected },
                    active && { backgroundColor: "#208AEF" },
                  ]}
                  onPress={() => toggleCurrency(c)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: active ? "#fff" : colors.text },
                    ]}
                  >
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <Pressable
          style={[styles.exportButton, { backgroundColor: "#208AEF" }]}
          onPress={handleExport}
        >
          <Text style={styles.exportButtonText}>
            {formatMessage({ id: "export.button.label" })}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "transparent",
  },
  sheet: {
    paddingHorizontal: Spacing.five,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.six,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    gap: Spacing.two,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: Spacing.four,
  },
  label: {
    fontSize: 13,
    marginTop: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
  },
  exportButton: {
    marginTop: Spacing.six,
    paddingVertical: Spacing.four,
    borderRadius: 8,
    alignItems: "center",
  },
  exportButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
