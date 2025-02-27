import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const Card = ({ iconSource, price, label, isFullWidth }) => {
  return (
    <View style={[styles.card, isFullWidth && styles.fullWidthCard]}>
      <Image source={iconSource} style={styles.cardIcon} />
      <Text style={[styles.price, isFullWidth && styles.centerText]}>{price}</Text>
      <Text style={[styles.label, isFullWidth && styles.centerText]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  fullWidthCard: {
    width: "100%",
    padding: 20,
    elevation: 3,
    alignItems: "center",
  },
  cardIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: "600",
    color: "#212121",
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: "#757575",
    lineHeight: 18,
  },
  centerText: {
    textAlign: "center",
  },
});

export default Card;
