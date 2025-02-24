import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const currentRoute = route.name;

  const isModuleActive = ["Modules", "Dépenses", "AjoutDepenses", "DetailDepenses"].includes(currentRoute);

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Accueil")}
        style={styles.footerItem}
      >
        <Icon 
          name="home" 
          size={24} 
          color={currentRoute === "Accueil" ? "#FFA500" : "#000"} 
        />
        <Text style={[styles.footerText, currentRoute === "Accueil" && styles.activeFooterText]}>
          Accueil
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Commandes")}
        style={styles.footerItem}
      >
        <Icon 
          name="list-alt" 
          size={24} 
          color={currentRoute === "Commandes" ? "#FFA500" : "#000"} 
        />
        <Text style={[styles.footerText, currentRoute === "Commandes" && styles.activeFooterText]}>
          Commandes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Produits")}
        style={styles.footerItem}
      >
        <Icon 
          name="tags" 
          size={24} 
          color={currentRoute === "Produits" ? "#FFA500" : "#000"} 
        />
        <Text style={[styles.footerText, currentRoute === "Produits" && styles.activeFooterText]}>
          Produits
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Categories")}
        style={styles.footerItem}
      >
        <Icon 
          name="th-large" 
          size={24} 
          color={currentRoute === "Categories" ? "#FFA500" : "#000"} 
        />
        <Text style={[styles.footerText, currentRoute === "Categories" && styles.activeFooterText]}>
          Catégories
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Modules")}
        style={styles.footerItem}
      >
        <Icon 
          name="cogs" 
          size={24} 
          color={isModuleActive ? "#FFA500" : "#000"} 
        />
        <Text style={[styles.footerText, isModuleActive && styles.activeFooterText]}>
          Modules
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  footerItem: {
    alignItems: "center",
    padding: 4,
  },
  footerText: {
    fontSize: 12,
    color: "#000",
  },
  activeFooterText: {
    color: "#FFA500",
    fontWeight: "bold",
  },
});

export default Footer;
