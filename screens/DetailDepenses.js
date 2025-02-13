import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker as NewPicker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import Footer from "../components/Footer";

const DetailDepenses = ({ navigation, route }) => {
  const depense = route.params?.depense;
  console.log("Dépense reçue dans DetailDepenses:", depense);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pieceJustificative, setPieceJustificative] = useState(null);

  const paymentMethodRef = useRef(depense?.payment_method || "WAVE");
  const [moyenPaiement, setMoyenPaiement] = useState(
    depense?.payment_method || "WAVE"
  );

  const [typeDepense, setTypeDepense] = useState(
    depense?.category || "SALAIRE"
  );
  const [motif, setMotif] = useState(depense?.title || "");
  const [montant, setMontant] = useState(
    depense?.amount?.replace("F CFA", "") || ""
  );

  const [autreType, setAutreType] = useState("");
  const [showAutreInput, setShowAutreInput] = useState(false);

  const [isAutreSelected, setIsAutreSelected] = useState(false);

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
      value: "ORANGE_MONEY",
      image: require("../assets/Orange.png"),
    },
    {
      id: "3",
      label: "FREE MONEY",
      value: "FREE_MONEY",
      image: require("../assets/free.png"),
    },
    {
      id: "4",
      label: "CASH",
      value: "CASH",
      icon: "cash",
    },
  ];

  useEffect(() => {
    paymentMethodRef.current = moyenPaiement;
  }, [moyenPaiement]);

  const renderPaymentMethod = ({ item }) => (
    <TouchableOpacity
      style={styles.paymentOption}
      onPress={() => {
        console.log(
          "Changement de moyen de paiement de",
          moyenPaiement,
          "à",
          item.value
        );
        setMoyenPaiement(item.value);
        paymentMethodRef.current = item.value;
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

  useEffect(() => {
    console.log("Moyen de paiement actuel:", moyenPaiement);
  }, [moyenPaiement]);

  const showConfirmationModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const dispatch = useDispatch();

  const handleUpdate = async () => {
    if (!motif || !montant) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", motif.trim());
      formData.append("amount", montant.replace(/\s/g, ""));
      formData.append("payment_method", paymentMethodRef.current);

      if (isAutreSelected) {
        formData.append("category", "AUTRE");
        formData.append("custom_category", typeDepense.trim());
      } else {
        formData.append("category", typeDepense);
      }

      if (pieceJustificative === null) {
        formData.append("piece_justificative", "delete");
      } else if (
        pieceJustificative &&
        pieceJustificative.uri.startsWith("file://")
      ) {
        formData.append("piece_justificative", {
          uri: pieceJustificative.uri,
          type:
            pieceJustificative.mimeType ||
            pieceJustificative.type ||
            "application/octet-stream",
          name: pieceJustificative.name,
        });
      }

      console.log("FormData complet avant envoi:");
      for (let pair of formData._parts) {
        console.log(pair[0], pair[1]);
      }

      const response = await fetch(
        `http://192.168.1.2:8000/api/depenses/${depense.id}/`,
        {
          method: "PATCH",
          body: formData,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur serveur:", errorData);
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      console.log("Mise à jour réussie:", data);

      if (data.piece_justificative) {
        const fileName = data.piece_justificative.split("/").pop();
        const fileType = fileName.toLowerCase().endsWith(".pdf")
          ? "application/pdf"
          : "image/jpeg";
        setPieceJustificative({
          uri: data.piece_justificative,
          type: fileType,
          name: fileName,
        });
      } else {
        setPieceJustificative(null);
      }

      navigation.navigate("Dépenses");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour de la dépense");
    }
  };

  const handleDelete = () => {
    showConfirmationModal("delete");
  };

  const confirmAction = async () => {
    try {
      if (modalType === "delete") {
        const response = await fetch(
          `http://192.168.1.2:8000/api/depenses/${depense.id}/`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok && response.status !== 204) {
          throw new Error("Erreur lors de la suppression");
        }

        console.log("Suppression réussie");
        setModalVisible(false);
        navigation.navigate("Dépenses");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de la dépense");
      setModalVisible(false);
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

  const removeDocument = () => {
    console.log("Suppression du fichier actuel");
    setPieceJustificative(null);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
      });

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        console.log("Nouveau fichier sélectionné:", selectedFile);

        setPieceJustificative({
          name: selectedFile.name,
          uri: selectedFile.uri,
          type: selectedFile.mimeType,
          mimeType: selectedFile.mimeType,
        });
      }
    } catch (err) {
      console.error("Erreur lors de l'importation:", err);
      alert("Erreur lors de l'importation du fichier");
    }
  };

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);

  useEffect(() => {
    navigation.setParams({
      component: {
        handleSave: handleUpdate,
        handleDelete: handleDelete,
      },
    });
  }, [motif, montant, typeDepense]);

  useEffect(() => {
    const loadPieceJustificative = async () => {
      console.log("État actuel de la pièce justificative:", pieceJustificative);
      console.log(
        "URL de la pièce justificative:",
        depense?.piece_justificative
      );

      if (depense?.piece_justificative && !pieceJustificative) {
        try {
          const fileName = depense.piece_justificative.split("/").pop();
          const fileType = fileName.toLowerCase().endsWith(".pdf")
            ? "application/pdf"
            : "image/jpeg";

          setPieceJustificative({
            uri: depense.piece_justificative,
            type: fileType,
            name: fileName,
          });

          console.log("Pièce justificative chargée:", {
            uri: depense.piece_justificative,
            type: fileType,
            name: fileName,
          });
        } catch (error) {
          console.error("Erreur lors du chargement du fichier:", error);
        }
      }
    };

    loadPieceJustificative();
  }, [depense]);

  useEffect(() => {
    if (typeDepense === "AUTRE") {
      setShowAutreInput(true);
      setAutreType(depense?.category || "");
    } else {
      setShowAutreInput(false);
      setAutreType("");
    }
  }, [typeDepense]);

  useEffect(() => {
    if (depense) {
      if (depense.category === "AUTRE" && depense.custom_category) {
        setIsAutreSelected(true);
        setTypeDepense(depense.custom_category);
      } else {
        setIsAutreSelected(false);
        setTypeDepense(depense.category);
      }
    }
  }, [depense]);

  const handleTypeChange = (value) => {
    if (value === "AUTRE") {
      setIsAutreSelected(true);
      setTypeDepense("");
    } else {
      setIsAutreSelected(false);
      if (value === "APPROVISIONNEMENT PRODUIT") {
        setTypeDepense("APPROVISIONNEMENT");
      } else {
        setTypeDepense(value);
      }
    }
  };

  const viewPDF = async (uri) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri);
      } else {
        alert("Le partage n'est pas disponible sur cet appareil");
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture du fichier:", error);
      alert("Impossible d'ouvrir le fichier");
    }
  };

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
        {!isAutreSelected ? (
          <NewPicker
            selectedValue={typeDepense}
            style={styles.picker}
            onValueChange={handleTypeChange}
          >
            <NewPicker.Item label="SALAIRE" value="SALAIRE" />
            <NewPicker.Item label="EAU" value="EAU" />
            <NewPicker.Item label="ELECTRICITÉ" value="ELECTRICITE" />
            <NewPicker.Item label="LOYER" value="LOYER" />
            <NewPicker.Item label="TRANSPORT" value="TRANSPORT" />
            <NewPicker.Item
              label="APPROVISIONNEMENT PRODUIT"
              value="APPROVISIONNEMENT"
            />
            <NewPicker.Item label="AUTRE" value="AUTRE" />
          </NewPicker>
        ) : (
          <View style={styles.typeInputContainer}>
            <TextInput
              style={styles.input}
              value={typeDepense}
              onChangeText={setTypeDepense}
              placeholder="Précisez le type de dépense"
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsAutreSelected(false);
                setTypeDepense("SALAIRE");
              }}
            >
              <MaterialCommunityIcons name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}

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
            <Text style={styles.selectedPaymentText}>
              {paymentMethods.find((p) => p.value === moyenPaiement)?.label ||
                moyenPaiement}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
        </TouchableOpacity>

        <Text style={styles.label}>Pièce justificative</Text>
        {!pieceJustificative ? (
          <TouchableOpacity style={styles.importButton} onPress={pickDocument}>
            <MaterialCommunityIcons name="upload" size={20} color="orange" />
            <Text style={styles.importText}>IMPORTER FICHIER</Text>
          </TouchableOpacity>
        ) : (
          <>
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

            {pieceJustificative && pieceJustificative.type?.includes("pdf") ? (
              <TouchableOpacity
                style={styles.pdfPreviewContainer}
                onPress={() => viewPDF(pieceJustificative.uri)}
              >
                <MaterialCommunityIcons
                  name="file-pdf-box"
                  size={40}
                  color="red"
                />
                <Text style={styles.pdfPreviewText}>
                  Appuyer pour voir le PDF
                </Text>
              </TouchableOpacity>
            ) : (
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
          </>
        )}
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
    width: "100%",
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
    height: 130,
    marginTop: 0,
    marginBottom: 20,
    borderRadius: 5,
  },
  modalImageContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  pdfPreviewContainer: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  pdfPreviewText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  modalHeader: {
    padding: 15,
    backgroundColor: "#333",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  pdf: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  autreInputContainer: {
    marginTop: -15,
    marginBottom: 25,
  },
  typeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    width: "100%",
  },
  cancelButton: {
    position: "absolute",
    right: 5,
    padding: 5,
    top: 12,
    zIndex: 1,
  },
});

export default DetailDepenses;
