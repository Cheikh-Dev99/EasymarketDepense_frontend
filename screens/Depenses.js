import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
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

const Depenses = ({ navigation }) => {
  const depensesData = [
    {
      id: "1",
      title: "Facture novembre SENELEC",
      amount: "2 360F CFA",
      category: "ELECTRICITÉ",
      time: "il y a 5 minutes",
    },
    {
      id: "2",
      title: "Salaire Fatim",
      amount: "2 360F CFA",
      category: "SALAIRE",
      time: "il y a 30 minutes",
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

  // Mettre à jour les temps affichés périodiquement
  useEffect(() => {
    const interval = setInterval(() => {
      setDepensesList((currentList) =>
        currentList.map((dep) => ({
          ...dep,
          time: getElapsedTime(dep.timestamp),
        }))
      );
    }, 60000); // Mise à jour toutes les minutes

    return () => clearInterval(interval);
  }, []);

  // Gérer l'ajout d'une nouvelle dépense
  useEffect(() => {
    const handleNewDepense = async () => {
      if (route.params?.newDepense) {
        try {
          console.log("Réception nouvelle dépense:", route.params.newDepense);

          const savedDepenses = await AsyncStorage.getItem("depenses");
          const currentDepenses = savedDepenses
            ? JSON.parse(savedDepenses)
            : [];

          const updatedDepenses = [route.params.newDepense, ...currentDepenses];

          // Vérifier que la pièce justificative est bien présente
          if (route.params.newDepense.pieceJustificative) {
            const fileInfo = await FileSystem.getInfoAsync(
              route.params.newDepense.pieceJustificative.uri
            );
            console.log("Vérification fichier dans Depenses.js:", fileInfo);
          }

          await AsyncStorage.setItem(
            "depenses",
            JSON.stringify(updatedDepenses)
          );
          console.log("Dépense sauvegardée avec succès");

          setDepensesList(
            updatedDepenses.map((dep) => ({
              ...dep,
              time: getElapsedTime(dep.timestamp),
            }))
          );

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
          data={depensesData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemAmount}>{item.amount}</Text>
              </View>
              <Text style={styles.itemCategory}>{item.category}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            /* Ajoutez la logique pour ajouter une dépense */
          }}
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
