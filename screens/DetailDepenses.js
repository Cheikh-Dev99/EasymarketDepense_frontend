import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker as NewPicker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Footer from "../components/Footer";

const DetailDepenses = ({ navigation, route }) => {
  const depense = route.params?.depense;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [typeDepense, setTypeDepense] = useState(
    depense?.category || "SALAIRE"
  );
  const [moyenPaiement, setMoyenPaiement] = useState(
    depense?.paymentMethod || "WAVE"
  );
  const [motif, setMotif] = useState(depense?.title || "");
  const [montant, setMontant] = useState(
    depense?.amount?.replace("F CFA", "") || ""
  );

  const paymentMethods = [
    {
      id: "1",
      label: "WAVE",
      value: "WAVE",
      image: require("../assets/wave.png"),
    },
    {
      id: "2",
      label: "ORANGE MONEY",
      value: "ORANGE MONEY",
      image: require("../assets/Orange.png"),
    },
    {
      id: "3",
      label: "FREE MONEY",
      value: "FREE MONEY",
      image: require("../assets/free.png"),
    },
    {
      id: "4",
      label: "CASH",
      value: "CASH",
      icon: "cash",
    },
  ];

  const renderPaymentMethod = ({ item }) => (
    <TouchableOpacity
      style={styles.paymentOption}
      onPress={() => {
        setMoyenPaiement(item.value);
        setShowPaymentModal(false);
      }}
    >
      {item.image ? (
        <Image source={item.image} style={styles.paymentLogo} />
      ) : (
        <MaterialCommunityIcons name={item.icon} size={24} color="#666" />
      )}
      <Text style={styles.paymentOptionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const selectedMethod = paymentMethods.find((p) => p.value === moyenPaiement);

  const showConfirmationModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!motif || !montant) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    showConfirmationModal("update");
  };

  const handleDelete = () => {
    showConfirmationModal("delete");
  };

  const confirmAction = async () => {
    try {
      const savedDepenses = await AsyncStorage.getItem("depenses");
      let depenses = savedDepenses ? JSON.parse(savedDepenses) : [];

      if (modalType === "update") {
        const updatedDepenses = depenses.map((dep) => {
          if (dep.id === depense.id) {
            return {
              ...dep,
              title: motif,
              amount: `${montant}F CFA`,
              category: typeDepense,
              paymentMethod: moyenPaiement,
              timestamp: Date.now(),
              time: "modifié à l'instant",
            };
          }
          return dep;
        });
        await AsyncStorage.setItem("depenses", JSON.stringify(updatedDepenses));
      } else if (modalType === "delete") {
        const updatedDepenses = depenses.filter((dep) => dep.id !== depense.id);
        await AsyncStorage.setItem("depenses", JSON.stringify(updatedDepenses));
      }

      setModalVisible(false);
      navigation.navigate("Dépenses", { refresh: true });
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const renderPickerItem = (label, value, iconName) => {
    return (
      <NewPicker.Item
        label={
          <View style={styles.pickerItemContainer}>
            <MaterialCommunityIcons name={iconName} size={24} color="#666" />
            <Text style={styles.pickerItemText}>{label}</Text>
          </View>
        }
        value={value}
      />
    );
  };

  useEffect(() => {
    navigation.setParams({
      component: {
        handleSave: handleUpdate,
        handleDelete: handleDelete,
      },
    });
  }, [motif, montant, typeDepense]);

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Attention !</Text>
            <Text style={styles.modalText}>
              {modalType === "update"
                ? "Souhaitez-vous vraiment enregistrer ces modifications ?"
                : "Souhaitez-vous vraiment supprimer cette dépense ?"}
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmAction}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonTextConfirm,
                  ]}
                >
                  {modalType === "update" ? "MODIFIER" : "SUPPRIMER"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
        <TouchableOpacity
          style={styles.paymentSelector}
          onPress={() => setShowPaymentModal(true)}
        >
          <View style={styles.selectedPayment}>
            {selectedMethod?.image ? (
              <Image source={selectedMethod.image} style={styles.paymentLogo} />
            ) : (
              <MaterialCommunityIcons
                name={selectedMethod?.icon || "cash"}
                size={24}
                color="#666"
              />
            )}
            <Text style={styles.selectedPaymentText}>{moyenPaiement}</Text>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
        </TouchableOpacity>

        <Text style={styles.label}>Pièce justificative</Text>
        <TouchableOpacity style={styles.importButton}>
          <MaterialCommunityIcons name="upload" size={20} color="orange" />
          <Text style={styles.importText}>IMPORTER FICHIER</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPaymentModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir le moyen de paiement</Text>
            <FlatList
              data={paymentMethods}
              renderItem={renderPaymentMethod}
              keyExtractor={(item) => item.id}
            />
          </View>
        </TouchableOpacity>
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  modalButtons: {
    flexDirection: "column",
    width: "100%",
    gap: 10,
  },
  modalButton: {
    borderRadius: 5,
    padding: 15,
    width: "100%",
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  modalButtonConfirm: {
    backgroundColor: "#FFA500",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  modalButtonTextConfirm: {
    color: "#fff",
  },
  pickerItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  pickerItemText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#2C3E50",
  },
  paymentSelector: {
    height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "lightgray",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  selectedPayment: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedPaymentText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#2C3E50",
  },
  paymentLogo: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  paymentOptionText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#2C3E50",
  },
});

export default DetailDepenses;
