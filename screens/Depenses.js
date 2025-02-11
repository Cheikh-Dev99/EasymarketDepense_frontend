import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";

import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Depenses = ({ navigation, route }) => {
  const [depensesList, setDepensesList] = useState([]);

  const getElapsedTime = (timestamp) => {
    const now = Date.now();
    const elapsed = now - timestamp;

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
    loadDepenses();
  }, []);


  const loadDepenses = async () => {
    try {
      const savedDepenses = await AsyncStorage.getItem("depenses");
      if (savedDepenses !== null) {
        const parsedDepenses = JSON.parse(savedDepenses);
        setDepensesList(parsedDepenses);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des dépenses:", error);
    }
  };

  // Sauvegarder les dépenses
  const saveDepenses = async (newList) => {
    try {
      await AsyncStorage.setItem("depenses", JSON.stringify(newList));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des dépenses:", error);
    }
  };

  // Mettre à jour les temps affichés
  useEffect(() => {
    const interval = setInterval(() => {
      setDepensesList((currentList) =>
        currentList.map((depense) => ({
          ...depense,
          time: getElapsedTime(depense.timestamp),
        }))
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Gérer l'ajout d'une nouvelle dépense
  useEffect(() => {
    const handleNewDepense = async () => {
      if (route.params?.newDepense) {
        try {
          // Charger les dépenses existantes
          const savedDepenses = await AsyncStorage.getItem("depenses");
          const currentDepenses = savedDepenses
            ? JSON.parse(savedDepenses)
            : [];

          // Créer la nouvelle dépense avec timestamp
          const newDepense = {
            ...route.params.newDepense,
            timestamp: Date.now(),
            time: "à l'instant",
          };

          // Combiner avec les dépenses existantes
          const updatedDepenses = [newDepense, ...currentDepenses];

          // Sauvegarder et mettre à jour l'état
          await saveDepenses(updatedDepenses);
          setDepensesList(updatedDepenses);

          // Réinitialiser les paramètres
          navigation.setParams({ newDepense: null });
        } catch (error) {
          console.error("Erreur lors de l'ajout de la dépense:", error);
        }
      }
    };

    handleNewDepense();
  }, [route.params?.newDepense]);

  // Gérer le rafraîchissement après modification/suppression
  useEffect(() => {
    if (route.params?.refresh) {
      loadDepenses();
      navigation.setParams({ refresh: null });
    }
  }, [route.params?.refresh]);

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
          placeholder="Rechercher ici"
          placeholderTextColor="#95A5A6"
        />
      </View>
      <View style={styles.main}>
        <FlatList
          data={depensesList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DetailDepenses", { depense: item })
              }
            >
              <View style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemAmount}>{item.amount}</Text>
                </View>
                <Text style={styles.itemCategory}>{item.category}</Text>
                <Text style={styles.itemTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
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
    width: "90",
    padding: 3,
    borderRadius: 5,
    color: "#fff",
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
});

export default Depenses;
