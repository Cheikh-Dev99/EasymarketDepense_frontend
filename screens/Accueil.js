import React, { useState } from "react";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DatePicker from "../components/DatePicker";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Card from "../components/resumeCard";
import cardsData from "../Data/cardData";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

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

          {/* Cartes de résumé*/}
          <View style={styles.dashboardContainer}>
            {cardsData.map((group) => (
              <View key={group.id}>
                {group.fullWidth ? (
                  <Card {...group.items[0]} isFullWidth={true} />
                ) : (
                  <View style={styles.twoColLayout}>
                    {group.items.map((item, index) => (
                      <Card key={index} {...item} />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
          {/* Statistiques */}
          <View style={styles.StatistiqueContainer}>
            <Text style={styles.StatistiqueText}>Statistiques</Text>
            <Image
              source={require("../assets/Statistique.png")}
              style={styles.StatistiqueImage}
            />
          </View>

          {/* Cartes de commande */}
          <View style={styles.commandSection}>
            <Text style={styles.sectionTitle}>
              Nombre de commandes par canal
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.channelsContainer}
            >
              {[
                {
                  count: 25,
                  channel: "WhatsApp",
                  Image: require("../assets/screen/icons/WhatsApp.png"),
                },
                {
                  count: 5,
                  channel: "Instagram",
                  Image: require("../assets/screen/icons/Instagram.png"),
                },
                {
                  count: 5,
                  channel: "TikTok",
                  Image: require("../assets/screen/icons/TikTok.png"),
                },
                {
                  count: 5,
                  channel: "Facebook",
                  Image: require("../assets/screen/icons/Facebook.png"),
                },
              ].map((item, index) => (
                <View key={index} style={styles.channelCard}>
                  <Image source={item.Image} style={styles.channelIcon} />
                  <Text style={styles.orderCount}>{item.count}</Text>
                  <Text style={styles.channelName}>{item.channel}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Cartes de chiffre d'affaire */}
          <View style={styles.chiffreAffaireContainer}>
            <Text style={styles.sectionTitle}>Chiffre d'affaire par canal</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chiffreScrollContainer}
            >
              {[
                {
                  count: "20 000 XOF",
                  channel: "WhatsApp",
                  Image: require("../assets/screen/icons/WhatsApp.png"),
                },
                {
                  count: "15 000 XOF",
                  channel: "Instagram",
                  Image: require("../assets/screen/icons/Instagram.png"),
                },
                {
                  count: "10 000 XOF",
                  channel: "TikTok",
                  Image: require("../assets/screen/icons/TikTok.png"),
                },
                {
                  count: "5 000 XOF",
                  channel: "Facebook",
                  Image: require("../assets/screen/icons/Facebook.png"),
                },
              ].map((item, index) => (
                <View key={index} style={styles.chiffreCard}>
                  <Image source={item.Image} style={styles.caIcon} />
                  <Text style={styles.caValue}>{item.count}</Text>
                  <Text style={styles.caChannel}>{item.channel}</Text>
                </View>
              ))}
            </ScrollView>
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
    padding: 15,
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
    marginTop: 5,
    marginBottom: 30,
    gap: 16,
  },
  twoColLayout: {
    flexDirection: "row",
    gap: 5,
  },
  StatistiqueContainer: {
    marginTop: 5,
    marginBottom: 20,
    gap: 16,
  },
  StatistiqueText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  StatistiqueImage: {
    width: "100%",
  },
  commandSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "600",
    color: "#2D2D2D",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  channelsContainer: {
    paddingLeft: 5,
    paddingVertical: 5,
    gap: 5,
  },
  channelCard: {
    width: 120,
    height: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    marginRight: 8,
    position: "relative",
  },
  channelIcon: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  orderCount: {
    fontSize: 28,
    fontWeight: "700",
    color: "black",
    marginBottom: 8,
    marginTop: 20,
  },
  channelName: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    lineHeight: 18,
  },
  chiffreAffaireContainer: {
    paddingLeft: 5,
    paddingVertical: 5,
    gap: 8,
  },
  chiffreScrollContainer: {
    paddingLeft: 5,
    gap: 5,
    paddingBottom: 15,
  },
  chiffreCard: {
    width: 180,
    height: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
    marginRight: 8,
    position: "relative",
  },
  caIcon: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  caValue: {
    fontSize: 25,
    fontWeight: "700",
    color: "black",
    marginBottom: 8,
    marginTop: 20,
    marginLeft: 20,
  },
  caChannel: {
    fontSize: 16,
    color: "#616161",
    textAlign: "center",
    fontWeight: "500",
  },
  footer: {
    marginTop: 50,
  },
});

export default Accueil;
