import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker as NewPicker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Footer from "../components/Footer";

const AjoutDepenses = ({ navigation }) => {
  const [typeDepense, setTypeDepense] = useState("SALAIRE");
  const [moyenPaiement, setMoyenPaiement] = useState("WAVE");
  const [motif, setMotif] = useState("");
  const [montant, setMontant] = useState("");

  const handleSave = () => {
    // Vérification que les champs requis sont remplis
    if (!motif || !montant) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const newDepense = {
      id: Date.now().toString(),
      title: motif,
      amount: `${montant}F CFA`,
      category: typeDepense,
      timestamp: Date.now(),
      time: "à l'instant",
    };

    // Réinitialiser les champs
    setMotif("");
    setMontant("");
    setTypeDepense("SALAIRE");
    setMoyenPaiement("WAVE");

    // Navigation avec la nouvelle dépense
    navigation.navigate("Dépenses", { newDepense: newDepense });
  };

  // Exposer handleSave au composant parent
  React.useEffect(() => {
    navigation.setParams({
      component: {
        handleSave: handleSave,
      },
    });
  }, [motif, montant, typeDepense, moyenPaiement]);

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.label}>Motif de la dépense</Text>
        <TextInput
          style={styles.input}
          value={motif}
          onChangeText={setMotif}
          placeholder="Entrez le motif"
        />

        <Text style={styles.label}>Montant de la dépense</Text>
        <TextInput
          style={styles.input}
          value={montant}
          onChangeText={setMontant}
          keyboardType="numeric"
          placeholder="Entrez le montant"
        />

        <Text style={styles.label}>Type de dépense</Text>
        <NewPicker
          selectedValue={typeDepense}
          style={styles.picker}
          onValueChange={(itemValue) => setTypeDepense(itemValue)}
        >
          <NewPicker.Item label="SALAIRE" value="SALAIRE" />
          <NewPicker.Item label="EAU" value="EAU" />
          <NewPicker.Item label="ELECTRICITÉ" value="ELECTRICITÉ" />
          <NewPicker.Item label="LOYER" value="LOYER" />
          <NewPicker.Item label="TRANSPORT" value="TRANSPORT" />
          <NewPicker.Item
            label="APPROVISIONNEMENT PRODUIT"
            value="APPROVISIONNEMENT PRODUIT"
          />
          <NewPicker.Item label="AUTRE" value="AUTRE" />
        </NewPicker>

        <Text style={styles.label}>Moyen de paiement utilisé</Text>
        <NewPicker
          selectedValue={moyenPaiement}
          style={styles.picker}
          onValueChange={(itemValue) => setMoyenPaiement(itemValue)}
        >
          <NewPicker.Item label="WAVE" value="WAVE" />
          <NewPicker.Item label="CASH" value="CASH" />
        </NewPicker>

        <Text style={styles.label}>Pièce justificative</Text>
        <TouchableOpacity style={styles.importButton}>
          <MaterialCommunityIcons name="upload" size={20} color="orange" />
          <Text style={styles.importText}>IMPORTER FICHIER</Text>
        </TouchableOpacity>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  main: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bolder",
    marginBottom: 5,
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 25,
    paddingHorizontal: 10,
    borderColor: "lightgray",
    backgroundColor: "#fff",
  },
  picker: {
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    borderColor: "lightgray",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  importButton: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  importText: {
    color: "#000",
    fontWeight: "bolder",
    marginLeft: 10,
    fontSize: 18,
  },
});

export default AjoutDepenses;
