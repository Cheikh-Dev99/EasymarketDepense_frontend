import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Accueil = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header title="Easy Market" />
      <View style={styles.main}>
        <Text style={styles.welcomeText}>Bienvenue sur Easymarket</Text>
      </View>
      <Footer navigation={navigation} />
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
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Accueil;
