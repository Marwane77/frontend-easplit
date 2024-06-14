import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import { PATH_lastTransaction } from "../utils/path";

// Composant Transaction
const Transaction = ({
  name,
  transactionText,
  transactionDescription,
  displayAmount,
}) => {
  return (
    <View style={styles.transactionContainer}>
      <View>
        <Text style={styles.transactionName}>{transactionText}</Text>
        <Text style={styles.transactionDescription}>
          {transactionDescription}
        </Text>
      </View>
      <Text style={styles.transactionAmount}>{displayAmount}</Text>
    </View>
  );
};

// Composant LastTransactions
const LastTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.value);
  const token = user.token;
  const balance = user.balance;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `${PATH_lastTransaction}/transactions/userTransactions/${token}`
        );

        if (!response.ok) {
          throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
        }

        const data = await response.json();
        //console.log("data des transactions", data);

        const formattedData = data.transactions.map((transaction) => {
          let transactionText = "";
          let transactionDescription = "";
          let displayAmount = "";

          if (transaction.type === "refund") {
            transactionText = `Remboursement +${transaction.name}`;
            transactionDescription = "Remboursement clôture événement";
            displayAmount = `+ ${transaction.amount} €`;
          } else if (transaction.type === "reload") {
            transactionText = "Rechargement";
            transactionDescription = "Rechargement de mon compte";
            displayAmount = `+ ${transaction.amount.toFixed(2)} €`;
          } else if (transaction.type === "payment") {
            transactionText = `${transaction.name}`;
            transactionDescription = "Participation";
            displayAmount = `- ${transaction.amount.toFixed(2)} €`;
          }

          return {
            ...transaction,
            transactionText,
            transactionDescription,
            displayAmount,
          };
        });

        setTransactions(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Échec de la récupération des transactions", error);
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [token, balance]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4E3CBB" />
      ) : (
        transactions
          .slice(0, 2)
          .map((item, index) => (
            <Transaction
              key={index}
              name={item.name}
              transactionText={item.transactionText}
              transactionDescription={item.transactionDescription}
              displayAmount={item.displayAmount}
            />
          ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  transactionContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    height: 60,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4E3CBB",
  },
  transactionDescription: {
    fontSize: 14,
    color: "#888",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff69b4",
    textAlign: "right",
  },
});

export default LastTransactions;
