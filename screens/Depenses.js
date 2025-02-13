import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import { fetchDepenses } from "../src/redux/features/depenses/depensesSlice";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Depenses = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    items: depensesList,
    status,
    error,
  } = useSelector((state) => state.depenses);
  const [searchText, setSearchText] = useState("");
  const [filteredDepenses, setFilteredDepenses] = useState([]);

  const getElapsedTime = (timestamp) => {
    const now = Date.now();
    const elapsed = now - new Date(timestamp).getTime();

    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "à l'instant";
    if (minutes < 60)
      return `il y a ${minutes} minute${minutes > 1 ? "s" : ""}`;
    if (hours < 24) return `il y a ${hours} heure${hours > 1 ? "s" : ""}`;
    return `il y a ${days} jour${days > 1 ? "s" : ""}`;
  };

  useEffect(() => {
    dispatch(fetchDepenses());
  }, [dispatch]);

  // Fonction de filtrage des dépenses
  const filterDepenses = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = depensesList.filter((depense) => {
        const searchTerms = text.toLowerCase();
        return (
          depense.title.toLowerCase().includes(searchTerms) ||
          depense.category.toLowerCase().includes(searchTerms)
        );
      });
      setFilteredDepenses(filtered);
    } else {
      setFilteredDepenses(depensesList);
    }
  };

  // Mettre à jour les dépenses filtrées quand la liste principale change
  useEffect(() => {
    setFilteredDepenses(depensesList);
  }, [depensesList]);

  if (status === "loading") {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color="#7F8C8D"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par titre ou catégorie"
          placeholderTextColor="#95A5A6"
          value={searchText}
          onChangeText={filterDepenses}
        />
      </View>
      <View style={styles.main}>
        {depensesList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="receipt" size={50} color="#ccc" />
            <Text style={styles.emptyText}>
              Aucune dépense enregistrée pour le moment.
            </Text>
            <Text style={styles.emptySubText}>
              Cliquez sur le + pour ajouter une nouvelle dépense.
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredDepenses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("DetailDepenses", { depense: item })
                }
              >
                <View style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemAmount}>{item.amount} FCFA</Text>
                  </View>
                  <Text style={[styles.itemCategory, { flex: 0 }]}>
                    {item.category === "AUTRE"
                      ? item.custom_category
                      : item.category}
                  </Text>
                  <Text style={styles.itemTime}>
                    {getElapsedTime(item.timestamp)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AjoutDepenses")}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingBottom: 70,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#FFA500",
  },
  backButton: {
    position: "absolute",
    left: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  main: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 25,
    marginVertical: 25,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#2C3E50",
    paddingVertical: 8,
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    maxWidth: "70%",
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFA500",
  },
  itemCategory: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
    backgroundColor: "#D3D3D3",
    padding: 3,
    borderRadius: 5,
    color: "#fff",
    alignSelf: "flex-start",
  },
  itemTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  addButton: {
    position: "absolute",
    bottom: 10,
    right: 20,
    backgroundColor: "#FFA500",
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Depenses;
