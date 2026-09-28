import { useListTransactions } from "@/hooks/use-list-transactions";
import { logout } from "@/services/auth";
import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function List() {
  const [loading, setLoading] = useState(false);
  const { transactions, isLoading, fetchNextPage, hasNextPage } =
    useListTransactions();

  async function handleSubmit() {
    setLoading(true);
    const result = await logout();
    setLoading(false);

    if (result.error) {
      // setError(result.error);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        accessibilityLabel="Logout"
        style={styles.button}
      >
        <Text>Logout</Text>
      </TouchableOpacity>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/details/${item.reference}`} asChild>
            <Pressable style={styles.row}>
              <Text>{item.reference}</Text>
              <Text>Receitas: {item.incoming_value}</Text>
              <Text>Despesas: {item.expense_value}</Text>
              <Text>Net income: {item.net_income}</Text>
            </Pressable>
          </Link>
        )}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text>Nenhuma transação encontrada.</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginVertical: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  row: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});
