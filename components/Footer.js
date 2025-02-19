import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Footer = ({ navigation }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Accueil")}
        style={styles.footerItem}
      >
        <MaterialCommunityIcons name="home-outline" size={30} color="#000" />
        <Text style={styles.footerText}>Accueil</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Commandes")}
        style={styles.footerItem}
      >
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={30}
          color="#000"
        />
        <Text style={styles.footerText}>Commandes</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Produits")}
        style={styles.footerItem}
      >
        <MaterialCommunityIcons name="tag-outline" size={30} color="#000" />
        <Text style={styles.footerText}>Produits</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Categories")}
        style={styles.footerItem}
      >
        <MaterialCommunityIcons
          name="view-grid-outline"
          size={30}
          color="#000"
        />
        <Text style={styles.footerText}>Catégories</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Modules")}
        style={styles.footerItem}
      >
        <Image 
          source={require('../assets/Modules.png')} 
          style={styles.footerIcon}
        />
        <Text style={[styles.footerText, styles.activeFooterText]}>
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
  },
  footerText: {
    fontSize: 12,
    color: "#000",
  },
  activeFooterText: {
    color: "#FFA500",
    fontWeight: "bold",
  },
  footerIcon: {
    width: 25,
    height: 25,
    marginBottom: 4,
    tintColor: '#FFA500',
  },
});

export default Footer;
