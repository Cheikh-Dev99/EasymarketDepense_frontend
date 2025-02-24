import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Categories = () => {
  return (
    <View style={styles.container}>
      <Header title="Catégories" />
      <View style={styles.main}>
        <Text style={styles.text}>Bienvenue sur l'écran Catégories</Text>
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Categories;
