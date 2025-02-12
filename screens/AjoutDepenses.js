import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker as NewPicker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import Footer from "../components/Footer";

const AjoutDepenses = ({ navigation }) => {
  const [typeDepense, setTypeDepense] = useState("SALAIRE");
  const [moyenPaiement, setMoyenPaiement] = useState("WAVE");
  const [motif, setMotif] = useState("");
  const [montant, setMontant] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pieceJustificative, setPieceJustificative] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const handleSave = async () => {
    if (!motif || !montant) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    let savedPieceJustificative = null;
    if (pieceJustificative) {
      try {
        // Créer un nom de fichier unique
        const fileName = `piece_${Date.now()}_${pieceJustificative.name}`;
        const newUri = FileSystem.documentDirectory + fileName;

        console.log("URI source:", pieceJustificative.uri);
        console.log("URI destination:", newUri);

        // Copier le fichier
        await FileSystem.copyAsync({
          from: pieceJustificative.uri,
          to: newUri,
        });

        // Vérifier que le fichier a bien été copié
        const fileInfo = await FileSystem.getInfoAsync(newUri);
        console.log("Fichier copié avec succès:", fileInfo);

        savedPieceJustificative = {
          name: pieceJustificative.name,
          uri: newUri,
          type: pieceJustificative.type,
        };

        console.log(
          "Pièce justificative sauvegardée:",
          savedPieceJustificative
        );
      } catch (error) {
        console.error("Erreur lors de la sauvegarde du fichier:", error);
        alert("Erreur lors de la sauvegarde du fichier");
        return;
      }
    }

    const newDepense = {
      id: Date.now().toString(),
      title: motif,
      amount: `${montant}F CFA`,
      category: typeDepense,
      paymentMethod: moyenPaiement,
      timestamp: Date.now(),
      time: "à l'instant",
      pieceJustificative: savedPieceJustificative,
    };

    console.log("Nouvelle dépense complète:", newDepense);
    navigation.navigate("Dépenses", { newDepense });
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        console.log("Fichier sélectionné:", selectedFile);

        setPieceJustificative({
          name: selectedFile.name,
          uri: selectedFile.uri,
          type: selectedFile.mimeType,
        });
      }
    } catch (err) {
      console.error("Erreur lors de l'importation:", err);
      alert("Erreur lors de l'importation du fichier");
    }
  };

  const removeDocument = () => {
    setPieceJustificative(null);
  };

  // Exposer handleSave au composant parent
  React.useEffect(() => {
    navigation.setParams({
      component: {
        handleSave: handleSave,
      },
    });
  }, [motif, montant, typeDepense, moyenPaiement, pieceJustificative]);

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

  const viewFile = () => {
    if (pieceJustificative) {
      console.log("Viewing file:", pieceJustificative); // Pour le débogage
      setShowFileModal(true);
    }
  };

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
              <Text style={styles.modalTitle}>
                Choisir le moyen de paiement
              </Text>
              <FlatList
                data={paymentMethods}
                renderItem={renderPaymentMethod}
                keyExtractor={(item) => item.id}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <Text style={styles.label}>Pièce justificative</Text>
        {console.log("État pieceJustificative:", pieceJustificative)}
        {!pieceJustificative ? (
          <TouchableOpacity style={styles.importButton} onPress={pickDocument}>
            <MaterialCommunityIcons name="upload" size={20} color="orange" />
            <Text style={styles.importText}>IMPORTER FICHIER</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.filePreviewContainer}>
            <View style={styles.fileInfo}>
              <MaterialCommunityIcons
                name={
                  pieceJustificative.type?.includes("pdf")
                    ? "file-pdf-box"
                    : "file-image"
                }
                size={24}
                color="orange"
              />
              <Text style={styles.fileName}>{pieceJustificative.name}</Text>
            </View>
            <TouchableOpacity onPress={removeDocument}>
              <MaterialCommunityIcons name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}

        {pieceJustificative && !pieceJustificative.type?.includes("pdf") && (
          <>
            <TouchableOpacity onPress={() => setImageModalVisible(true)}>
              <Image
                source={{ uri: pieceJustificative.uri }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <Modal
              visible={imageModalVisible}
              transparent={true}
              onRequestClose={() => setImageModalVisible(false)}
            >
              <TouchableWithoutFeedback
                onPress={() => setImageModalVisible(false)}
              >
                <View style={styles.modalImageContainer}>
                  <Image
                    source={{ uri: pieceJustificative.uri }}
                    style={styles.fullScreenImage}
                    resizeMode="contain"
                  />
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </>
        )}
      </View>
      <Footer navigation={navigation} />

      {/* Modal pour visualiser le fichier */}
      <Modal
        visible={showFileModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFileModal(false)}
      >
        <View style={styles.fileModalContainer}>
          <View style={styles.fileModalHeader}>
            <Text style={styles.fileModalTitle}>
              {pieceJustificative?.name}
            </Text>
            <TouchableOpacity
              onPress={() => setShowFileModal(false)}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          {pieceJustificative?.type?.startsWith("image/") ? (
            <Image
              source={{ uri: pieceJustificative.uri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            <WebView
              source={{ uri: pieceJustificative?.uri }}
              style={styles.webview}
            />
          )}
        </View>
      </Modal>
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
  picker: {
    height: 60,
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  importButton: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    borderWidth: 1,
    borderColor: "lightgray",
    flexDirection: "row",
    alignItems: "center",
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileNameContainer: {
    flex: 1,
    marginLeft: 10,
  },
  importText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  viewIconButton: {
    marginLeft: 10,
    padding: 5,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
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
  paymentLogo: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  filePreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileName: {
    marginLeft: 10,
    fontSize: 16,
    color: "#2C3E50",
    flex: 1,
  },
  imagePreview: {
    width: "100%",
    height: 120,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  modalImageContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
});

export default AjoutDepenses;
