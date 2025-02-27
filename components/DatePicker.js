import React from "react";
import { Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePicker = ({ showStartPicker, showEndPicker, startDate, endDate, handleDateChange }) => {
  return (
    <>
      {/* Pickers pour Android */}
      {showStartPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="spinner"
          onChange={(event, date) => handleDateChange("start", event, date)}
        />
      )}

      {showEndPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="spinner"
          onChange={(event, date) => handleDateChange("end", event, date)}
        />
      )}

      {/* Pickers pour iOS */}
      {showStartPicker && Platform.OS === "ios" && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="inline"
          onChange={(event, date) => handleDateChange("start", event, date)}
          style={styles.iosPicker}
        />
      )}

      {showEndPicker && Platform.OS === "ios" && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="inline"
          onChange={(event, date) => handleDateChange("end", event, date)}
          style={styles.iosPicker}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  iosPicker: {
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default DatePicker;
