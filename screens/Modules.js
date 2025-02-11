import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import Footer from "../components/Footer";

import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Modules = ({ navigation }) => {
  // Données des cartes principales
  const mainCards = [
    {
      id: "1",
      title: "Promos",
      icon: require("../assets/Promos.png"),
    },
    {
      id: "2",
      title: "Vendeurs",
      icon: require("../assets/Vendeurs.png"),
    },
    {
      id: "3",
      title: "Dépenses",
      icon: require("../assets/Dépenses.png"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/Easymarket-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>Modules</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="bell-outline"
              size={30}
              color="#000"
              style={{ marginRight: 5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="account-outline"
              size={30}
              color="#000"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.main}>
        <FlatList
          data={mainCards}
          numColumns={2}
          columnWrapperStyle={styles.row}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate(item.title)}
            >
              <View style={styles.cardContent}>
                <Image source={item.icon} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#fff",
    elevation: 4,
    paddingTop: 70,
    paddingBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  main: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    width: "48%",
    height: 160,
    backgroundColor: "#FFA500",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    elevation: 3,
    marginBottom: 15,
  },
  cardContent: {
    alignItems: "center",
  },
  cardImage: {
    width: 50,
    height: 50,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
  },
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
});

export default Modules;
