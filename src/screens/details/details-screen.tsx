import { useDetailsTransactions } from "@/hooks/use-details-transactions";
import {
    ActivityIndicator,
    SectionList,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Section = {
  title: string;
  data: Array<{ id: string; label: string; value: number }>;
};

export default function DetailsScreen() {
  const { reference, incomings, expenses, isLoading, isError } =
    useDetailsTransactions();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Não foi possível carregar os detalhes.</Text>
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{reference}</Text>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text>{item.label}</Text>
            <Text>{item.value}</Text>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum dado encontrado.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  empty: { color: "#888" },
});
