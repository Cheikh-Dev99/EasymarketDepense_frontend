import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import DatePicker from "../components/DatePicker";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Accueil = () => {
  const navigation = useNavigation();
  const [activePeriod, setActivePeriod] = useState("Aujourd'hui");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleDateChange = (type, event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || (type === "start" ? startDate : endDate);

      if (type === "start") {
        setStartDate(currentDate);
        setShowStartPicker(Platform.OS === "ios");
      } else {
        setEndDate(currentDate);
        setShowEndPicker(Platform.OS === "ios");
      }
    } else {
      if (type === "start") {
        setShowStartPicker(false);
      } else {
        setShowEndPicker(false);
      }
    }
  };

  const resetDate = (type) => {
    if (type === "start") {
      setStartDate(null);
    } else {
      setEndDate(null);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Easy Market" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.main}>
          {/* Barre de périodes */}
          <View style={styles.periodContainer}>
            <TouchableOpacity
              style={[
                styles.periodButton,
                styles.firstButton,
                activePeriod === "Aujourd'hui" && styles.activeButton,
              ]}
              onPress={() => setActivePeriod("Aujourd'hui")}
            >
              <Text
                style={[
                  styles.periodText,
                  activePeriod === "Aujourd'hui" && styles.activeText,
                ]}
              >
                Aujourd'hui
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodButton,
                styles.middleButton,
                activePeriod === "Semaine" && styles.activeButton,
              ]}
              onPress={() => setActivePeriod("Semaine")}
            >
              <Text
                style={[
                  styles.periodText,
                  activePeriod === "Semaine" && styles.activeText,
                ]}
              >
                Semaine
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodButton,
                styles.middleButton,
                activePeriod === "Mois" && styles.activeButton,
              ]}
              onPress={() => setActivePeriod("Mois")}
            >
              <Text
                style={[
                  styles.periodText,
                  activePeriod === "Mois" && styles.activeText,
                ]}
              >
                Mois
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.periodButton,
                styles.lastButton,
                activePeriod === "Année" && styles.activeButton,
              ]}
              onPress={() => setActivePeriod("Année")}
            >
              <Text
                style={[
                  styles.periodText,
                  activePeriod === "Année" && styles.activeText,
                ]}
              >
                Année
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sélecteurs de date */}
          <DatePicker
            showStartPicker={showStartPicker}
            showEndPicker={showEndPicker}
            startDate={startDate}
            endDate={endDate}
            handleDateChange={handleDateChange}
          />
          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowStartPicker(true)}
            >
              <View style={styles.dateContent}>
                <Text style={styles.dateLabel}>
                  {startDate ? startDate.toLocaleDateString() : "Début période"}
                </Text>
                <View style={styles.iconContainer}>
                  {startDate ? (
                    <TouchableOpacity onPress={() => resetDate("start")}>
                      <AntDesign name="closecircle" size={20} color="red" />
                    </TouchableOpacity>
                  ) : (
                    <Image
                      source={require("../assets/screen/calendrier.png")}
                      style={styles.calendarIcon}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.arrow}>→</Text>

            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowEndPicker(true)}
            >
              <View style={styles.dateContent}>
                <Text style={styles.dateLabel}>
                  {endDate ? endDate.toLocaleDateString() : "Fin période"}
                </Text>
                <View style={styles.iconContainer}>
                  {endDate ? (
                    <TouchableOpacity onPress={() => resetDate("end")}>
                      <AntDesign name="closecircle" size={20} color="red" />
                    </TouchableOpacity>
                  ) : (
                    <Image
                      source={require("../assets/screen/calendrier.png")}
                      style={styles.calendarIcon}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Carte de résumé */}
          <View style={styles.dashboardContainer}>
            {/* Première ligne - Carte pleine largeur */}
            <View style={styles.fullWidthCard}>
              <Image
                source={require("../assets/screen/icons/Activity.png")}
                style={styles.cardIcon}
              />
              <Text style={styles.mainPrice}>50.000 XOF</Text>
              <Text style={styles.mainLabel}>Chiffre D'affaires (CA)</Text>
            </View>

            {/* Deuxième ligne - Deux cartes égales */}
            <View style={styles.twoColLayout}>
              <View style={styles.halfWidthCard}>
                <Image
                  source={require("../assets/screen/icons/Rectangle.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.secondaryPrice}>35 000 XOF</Text>
                <Text style={styles.secondaryLabel}>
                  Coût Des Produits Vendus
                </Text>
              </View>

              <View style={styles.halfWidthCard}>
                <Image
                  source={require("../assets/screen/icons/Rectangle.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.secondaryPrice}>20 000 XOF</Text>
                <Text style={styles.secondaryLabel}>Dépenses</Text>
              </View>
            </View>

            {/* Troisième ligne - Deux cartes égales */}
            <View style={styles.twoColLayout}>
              <View style={styles.halfWidthCard}>
                <Image
                  source={require("../assets/screen/icons/marge.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.secondaryPrice}>15 000 XOF</Text>
                <Text style={styles.secondaryLabel}>Marge : CA - Coût</Text>
              </View>

              <View style={styles.halfWidthCard}>
                <Image
                  source={require("../assets/screen/icons/depense.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.secondaryPrice}>30 000 XOF</Text>
                <Text style={styles.secondaryLabel}>
                  Caisse : CA - Dépenses
                </Text>
              </View>
            </View>
            {/* Deuxième ligne - Deux cartes égales */}
            <View style={styles.twoColLayout}>
              <View style={styles.halfWidthCard}>
                <Image
                  source={require("../assets/screen/icons/boucle.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.secondaryPrice}>35 000 XOF</Text>
                <Text style={styles.secondaryLabel}>Commande en cours</Text>
              </View>

              <View style={styles.halfWidthCard}>
                <Image
                  source={require("../assets/screen/icons/cible.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.secondaryPrice}>20 000 XOF</Text>
                <Text style={styles.secondaryLabel}>Commandes impayées</Text>
              </View>
            </View>

            {/* Troisième ligne - Deux cartes égales */}
            <View style={styles.twoColLayout}>
              <View style={styles.halfWidthCard}>
                <Image
                  source={require("../assets/screen/icons/cube.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.secondaryPrice}>15 000 XOF</Text>
                <Text style={styles.secondaryLabel}>Nombre d’articles</Text>
              </View>

              <View style={styles.halfWidthCard}>
                <Image
                  source={require("../assets/screen/icons/valeur.png")}
                  style={styles.cardIcon}
                />
                <Text style={styles.secondaryPrice}>30 000 XOF</Text>
                <Text style={styles.secondaryLabel}>Valeur du stock</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Footer navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  scrollContainer: {
    padding: 20,
  },
  main: {
    flex: 1,
  },
  periodContainer: {
    flexDirection: "row",
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
  },
  periodButton: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 8,
    flex: 1,
    alignItems: "center",
    borderColor: "#D0D0D0",
  },
  firstButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  lastButton: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  periodText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  activeButton: {
    backgroundColor: "#fff",
    borderColor: "white",
    borderRadius: 10,
    elevation: 5,
    marginVertical: 2,
  },
  activeText: {
    color: "#FFA500",
    fontWeight: "bold",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 15,
  },
  dateInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#7A7A7A",
    padding: 8,
  },
  dateContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateLabel: {
    color: "#7A7A7A",
    fontSize: 14,
    flex: 1,
  },
  iconContainer: {
    padding: 5,
  },
  arrow: {
    fontSize: 18,
    color: "#7A7A7A",
    marginHorizontal: 0,
  },
  calendarIcon: {
    width: 20,
    height: 20,
  },
  dashboardContainer: {
    marginTop: 25,
    gap: 16,
  },
  fullWidthCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  twoColLayout: {
    flexDirection: "row",
    gap: 5,
  },
  halfWidthCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  mainPrice: {
    fontSize: 28,
    fontWeight: "700",
    color: "black",
    marginVertical: 8,
  },
  mainLabel: {
    fontSize: 16,
    color: "#616161",
    textAlign: "center",
  },
  secondaryPrice: {
    fontSize: 22,
    fontWeight: "600",
    color: "#212121",
    marginVertical: 6,
  },
  secondaryLabel: {
    fontSize: 14,
    color: "#757575",
    lineHeight: 18,
  },
  cardIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  footer: {
    marginTop: 50,
  },
});

export default Accueil;
