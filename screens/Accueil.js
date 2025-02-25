import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Accueil = () => {
  const navigation = useNavigation();
  const [activePeriod, setActivePeriod] = useState("Aujourd'hui");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleDateChange = (type, selectedDate) => {
    const currentDate = selectedDate || (type === "start" ? startDate : endDate);
    
    if (type === "start") {
      setStartDate(currentDate);
      setShowStartPicker(Platform.OS === 'ios');
    } else {
      setEndDate(currentDate);
      setShowEndPicker(Platform.OS === 'ios');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Easy Market" />
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
              styles.lastButton,
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
        </View>

        {/* Sélecteurs de date */}
        <View style={styles.dateContainer}>
          <TouchableOpacity
            style={[styles.dateField, styles.dateInput]}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.placeholder}>
              {startDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <Text style={styles.arrow}>→</Text>

          <TouchableOpacity
            style={[styles.dateField, styles.dateInput]}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.placeholder}>
              {endDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pickers pour Android */}
        {showStartPicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="spinner"
            onChange={(event, date) => {
              handleDateChange("start", date);
              setShowStartPicker(false);
            }}
          />
        )}

        {showEndPicker && Platform.OS === 'android' && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="spinner"
            onChange={(event, date) => {
              handleDateChange("end", date);
              setShowEndPicker(false);
            }}
          />
        )}

        {/* Pickers pour iOS */}
        {Platform.OS === 'ios' && (
          <>
            <DateTimePicker
              value={startDate}
              mode="date"
              display="inline"
              onChange={(event, date) => handleDateChange("start", date)}
              style={styles.iosPicker}
              visible={showStartPicker}
            />

            <DateTimePicker
              value={endDate}
              mode="date"
              display="inline"
              onChange={(event, date) => handleDateChange("end", date)}
              style={styles.iosPicker}
              visible={showEndPicker}
            />
          </>
        )}
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
    padding: 20,
  },
  periodContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  periodButton: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 12,
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D0D0D0",
  },
  firstButton: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    marginRight: 2,
  },
  lastButton: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginLeft: 2,
  },
  periodText: {
    color: "#000",
    fontSize: 14,
  },
  activeButton: {
    backgroundColor: "#fff",
    borderColor: "#FFA500",
  },
  activeText: {
    color: "#FFA500",
    fontWeight: "bold",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  iosPicker: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeholder: {
    color: "#9B9B9B",
  },
  arrow: {
    fontSize: 18,
    color: "#7A7A7A",
  },
});

export default Accueil;
