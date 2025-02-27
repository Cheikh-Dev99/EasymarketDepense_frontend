import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"

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
        <Image
          source={require("../assets/footer/Accueil.png")}
          style={[
            styles.footerIcon,
            { tintColor: currentRoute === "Accueil" ? "#FFA500" : "#000" },
          ]}
        />
        <Text
          style={[
            styles.footerText,
            currentRoute === "Accueil" && styles.activeFooterText,
          ]}
        >
          Accueil
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Commandes")}
        style={styles.footerItem}
      >
        <Image
          source={require("../assets/footer/Commandes.png")}
          style={[
            styles.footerIcon,
            { tintColor: currentRoute === "Commandes" ? "#FFA500" : "#000" },
          ]}
        />
        <Text
          style={[
            styles.footerText,
            currentRoute === "Commandes" && styles.activeFooterText,
          ]}
        >
          Commandes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Produits")}
        style={styles.footerItem}
      >
        <Image
          source={require("../assets/footer/Produits.png")}
          style={[
            styles.footerIcon,
            { tintColor: currentRoute === "Produits" ? "#FFA500" : "#000" },
          ]}
        />
        <Text
          style={[
            styles.footerText,
            currentRoute === "Produits" && styles.activeFooterText,
          ]}
        >
          Produits
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Categories")}
        style={styles.footerItem}
      >
        <Image
          source={require("../assets/footer/Categories.png")}
          style={[
            styles.footerIcon,
            { tintColor: currentRoute === "Categories" ? "#FFA500" : "#000" },
          ]}
        />
        <Text
          style={[
            styles.footerText,
            currentRoute === "Categories" && styles.activeFooterText,
          ]}
        >
          Catégories
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Modules")}
        style={styles.footerItem}
      >
        <Image
          source={require("../assets/footer/Modules.png")}
          style={[
            styles.footerIcon,
            { tintColor: isModuleActive ? "#FFA500" : "#000" },
          ]}
        />
        <Text
          style={[styles.footerText, isModuleActive && styles.activeFooterText]}
        >
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
  footerIcon: {
    width: 24,
    height: 24,
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
