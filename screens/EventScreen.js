import { StyleSheet } from "react-native";
import globalStyles from "../styles/globalStyles";
import { LinearGradient } from "expo-linear-gradient";
import DropdownMenu from "../components/DropdownMenu";
import Icon from "react-native-vector-icons/Ionicons";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  TextInput,
  Pressable,
  Modal,
  Button,
  KeyboardAvoidingView
} from "react-native";
import Input from "../components/Input";
import React, { useState, useEffect, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { PATH } from "../utils/path";
import GuestInput from "../components/GuestInput";
import { addExpense } from "../reducers/event";
import EventPayment from "../components/EventPayment";
import * as ImagePicker from "expo-image-picker";

export default function EventScreen({ route, navigation }) {
  const { eventId } = route.params;
  const user = useSelector((state) => state.user.value);
  const isFocused = useIsFocused();
  const [event, setEvent] = useState({});
  const [selectedComponent, setSelectedComponent] = useState("expenses");
  const [expenses, setExpenses] = useState([]);
  const [errorMessage, seterrorMessage] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch(`${PATH}/events/event/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setEvent(data.event);
          // Fetch the updated remainingBalance from the event data
          let remainingBalance = data.event && data.event.remainingBalance ? data.event.remainingBalance : 0;
          // Use the remainingBalance in your component
        }
      });
  }, [isFocused]);
  
  const fetchExpenses = async () => {
    try {
      const response = await fetch(`${PATH}/transactions/expenses/${eventId}`);
      const data = await response.json();
  
      if (data.response) {
        setExpenses(data.expenses);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  useEffect(() => {
    fetchExpenses();
  }, []);

  const EventExpense = ({ expenses, event, eventId, fetchExpenses, setExpenses }) => {
    const currentUser = useSelector((state) => state.user.value);
    const isOrganizer = event.organizer && event.organizer.email === currentUser.email;
    const dispatch = useDispatch();
    const [expenseName, setExpenseName] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPhotoVisible, setModalPhotoVisible] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [expenseAmount, setExpenseAmount] = useState("");
    const [imageName, setImageName] = useState("");
    const [urlImage, setUrlImage] = useState("");

    const handleIconClick = (expense) => {
      setSelectedExpense(expense);
      setModalPhotoVisible(true);
    };

    const saveImage = async (image) => {
      try {
        setModalVisible(false);
      } catch (error) {
        throw error;
      }
    };

    const takePhoto = async () => {
      try {
        await ImagePicker.requestCameraPermissionsAsync();
        let result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          allowsEditing: true,
          aspect: [3, 5],
          quality: 1,
        });
        if (!result.canceled) {
          await saveImage(result.assets[0].uri);
          const formData = new FormData();

          formData.append("photoFromFront", {
            uri: result.assets[0].uri,
            name: "photo.jpg",
            type: "image/jpeg",
          });

          const response = await fetch(`${PATH}/events/upload`, {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          if (data.result) {
            setUrlImage(data.url);
            console.log("Image URL:", data.url);
          } else {
            console.error("Error uploading image:", data.error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    const choosePhotoFromLibrary = async () => {
      try {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 5],
          quality: 1,
        });
        if (!result.canceled) {
          await saveImage(result.assets[0].uri);
          const formData = new FormData();

          formData.append("photoFromFront", {
            uri: result.assets[0].uri,
            name: "photo.jpg",
            type: "image/jpeg",
          });

          const response = await fetch(`${PATH}/events/upload`, {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          if (data.result) {
            setUrlImage(data.url);
            console.log("Image URL:", data.url);
          } else {
            console.error("Error uploading image:", data.error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    const submitExpense = async () => {
      try {
        if (imageName.trim() === "") {
          alert("Please add an invoice name");
        } else {
          const requestBody = {
            emitter: eventId,
            amount: Number(expenseAmount),
            type: "expense",
            name: expenseName,
            invoice: urlImage,
          };

          console.log("Request body:", requestBody);

          const response = await fetch(`${PATH}/transactions/create/expense`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          const data = await response.json();
          console.log("Response:", data);

          if (data.response) { // Utilisez 'response' au lieu de 'success'
            fetchExpenses();
            setExpenseName("");
            setExpenseAmount("");
            setImageName("");
            setUrlImage("");
          } else {
            console.error("Error in response:", data.message);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    let remainingBalance = event && event.totalSum ? event.totalSum : 0;

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  if (remainingBalance > 0) {
    remainingBalance -= totalExpenses;
  }

    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <View style={{ marginTop: 30 }}>
        <View style={{ height: expenses.length > 0 ? 220 : 0 }}>
            <ScrollView showsVerticalScrollIndicator={true}>
              {[...expenses]
                .reverse()
                .map((expense, index) => (
                  <View
                    key={index}
                    style={[
                      styles.listCard,
                      Platform.OS === "ios"
                        ? styles.shadowIOS
                        : styles.shadowAndroid,
                    ]}
                  >
                    <Text style={styles.textCurrentListCard}>{expense.name}</Text>
                    <View style={styles.leftPartInsideCard}>
                      <Text
                        style={{ ...styles.textCurrentListCard, marginRight: 30 }}
                      >
                        {expense.amount}€
                      </Text>
                      <TouchableOpacity onPress={() => handleIconClick(expense)}>
                        <Icon
                          name="document-text-sharp"
                          size={25}
                          color="#4E3CBB"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
            </ScrollView>
          </View>
    
          {isOrganizer && (
            <View style={{ marginTop: 20 }}>
              <View
                style={[
                  { ...styles.listCard, marginBottom: 30 },
                  Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
                ]}
              >
                <TextInput
                  style={styles.textAddingCard}
                  placeholder="Nom  "
                  value={expenseName}
                  onChangeText={(value) => setExpenseName(value)}
                />
                <View style={styles.leftPartInsideCard}>
                  <TextInput
                    style={{ ...styles.textAddingCard, marginRight: 30 }}
                    placeholder="XX€ "
                    keyboardType="numeric"
                    value={expenseAmount}
                    onChangeText={(text) => {
                      if (text.includes(".") && text.split(".")[1].length > 2) {
                        const truncatedText = text.substring(
                          0,
                          text.indexOf(".") + 3
                        );
                        setExpenseAmount(truncatedText);
                      } else if (!isNaN(text)) {
                        setExpenseAmount(text);
                      }
                    }}
                  /> 
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Icon name="document-text-sharp" size={25} color="#EB1194" />
                  </TouchableOpacity>
    
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                        <TextInput
                          style={styles.input}
                          placeholder="Nom de l'image"
                          value={imageName}
                          onChangeText={(text) => setImageName(text)}
                        />
                        
                        <TouchableOpacity
                          style={[styles.button, styles.buttonChosePicture]}
                          onPress={() => takePhoto()}>
                          <Text style={styles.textStyleChoose}>Prendre une photo</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[styles.button, styles.buttonChosePicture]}
                          onPress={() => choosePhotoFromLibrary()}>
                          <Text style={styles.textStyleChoose}>Choisir une photo de la bibliothèque</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[styles.button, styles.buttonClose]}
                          onPress={() => setModalVisible(!modalVisible)}
                        >
                          <Text style={styles.textStyle}>Fermer</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                  <TouchableOpacity onPress={submitExpense}>
                    <Icon name="add-circle" size={30} color="#EB1194"></Icon>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
    
          <View
            style={[
              styles.recapCard,
              Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
            ]}
          >
            <View style={styles.recapCardRow}>
              <View style={styles.amount}>
                <Text style={styles.textRecapAmount}>{event.totalSum}€</Text>
                <Text style={styles.textRecap}>Budget initial</Text>
              </View>
              <View style={styles.amount}>
                <Text style={styles.textRecapAmount}>{totalExpenses}€</Text>
                <Text style={styles.textRecap}>Total des dépenses</Text>
              </View>
            </View>
            <View style={[styles.amount, {marginTop: -10}]}>
              <Text style={[styles.textRecapBalance, {marginBottom: 0}]}>{remainingBalance}€</Text>
              <Text style={[styles.textRecap, {marginTop: 0}]}>Solde restant</Text>
            </View>
          </View>
    
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalPhotoVisible}
            onRequestClose={() => setModalPhotoVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {selectedExpense && (
                  <Image
                    source={{ uri: selectedExpense.invoice }}
                    style={styles.image}
                  />
                )}
                <TouchableOpacity  onPress={() => setModalPhotoVisible(false)}>
                <Text style={styles.closeImage} >Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    );
  };    
  
  const renderSelectedComponent = () => {
    if (selectedComponent === "expenses") {
      return (
        <EventExpense
          expenses={expenses}
          event={event}
          eventId={eventId}
          fetchExpenses={fetchExpenses}
          setExpenses={setExpenses}
        />
      );
    } else {
      return (
        <EventPayment
          expenses={expenses}
          event={event}
          eventId={eventId}
          navigation={navigation}
        />
      );
    }
  };

  return (
    <LinearGradient
      style={styles.container}
      colors={["white", "#CAD1E0"]}
      start={[0.2, 0.2]}
      end={[0.8, 0.8]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ ...styles.scrollView }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Image
            source={require("../assets/EASPLIT-NOIR.png")}
            style={styles.logo}
          />
          <DropdownMenu />
        </View>
        <TouchableOpacity
          style={styles.goback}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("EventsList")}
        >
          <Icon name="arrow-back" size={35} color="#4E3CBB"></Icon>
          <Text style={styles.textGoBack}>{event.name}</Text>
        </TouchableOpacity>

        <View style={styles.toggleSelection}>
          <Pressable
            style={[
              styles.button,
              selectedComponent === "expenses" && styles.selectedButton,
            ]}
            onPress={() => setSelectedComponent("expenses")}
          >
            <Text style={styles.textButton}>Toutes les dépenses</Text>
          </Pressable>
          <Pressable
            style={[
              styles.button,
              selectedComponent === "payments" && styles.selectedButton,
            ]}
            onPress={() => setSelectedComponent("payments")}
          >
            <Text style={styles.textButton}>Tous les paiements</Text>
          </Pressable>
        </View>
        <View>{renderSelectedComponent()}</View>
      </ScrollView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  //MAINS CONTAINERS
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  goback: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 30,
    marginBottom: 30,
  },
  scrollView: {
    marginBottom: 20,
  },
  participer: {
    height: 25,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  toggleSelection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4E3CBB33",
    borderRadius: 5,
  },
  button: {
    paddingHorizontal: 10,
    width: "50%",
  },
  selectedButton: {
    backgroundColor: "#4E3CBB",
    borderRadius: 5,
  },
  listCard: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    height: 60,
    marginHorizontal: 10, 
  },
  shadowAndroid: {
    elevation: 6,
  },
  shadowIOS: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  leftPartInsideCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  recapCard: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 50,
    height: 200,
    marginHorizontal: 10,
    marginTop: 15,
  },
  recapCardRow: {
    flexDirection: "row",
    justifyContent: "space-between", 
    
  },
  amount: {
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  RecapEventCard: {
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 20,
    height: 150,
  },
  textGoBack: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#4E3CBB",
    fontSize: 20,
    marginLeft: 20,
  },
  textButton: {
    color: "#FFFFFF",
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 16,
    textAlign: "center",
  },
  textCurrentListCard: {
    fontFamily: "CodecPro-Regular",
    color: "#4E3CBB",
    fontSize: 16,
  },
  textAddingCard: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#EB1194",
    fontSize: 16,
  },
  message: {
    fontFamily: "CodecPro-Regular",
    color: "#EB1194",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  textRecap: {
    fontFamily: "CodecPro-Regular",
    color: "#4E3CBB",
    fontSize: 16,
    marginTop: 10,
  },
  textRecapAmount: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#4E3CBB",
    fontSize: 20,
  },
  textRecapBalance: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#EB1194",
    fontSize: 25,
  },
  currentUserText: {
    fontFamily: "CodecPro-ExtraBold",
    color: "#4E3CBB",
    fontSize: 20,
  },
  textPaymentRecapLeft: {
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 16,
    color: "#4E3CBB",
  },
  textSmallCurrentListCard: {
    fontFamily: "CodecPro-Regular",
    color: "#4E3CBB",
    fontSize: 12,
  },
  error: {
    marginTop: 10,
    color: "red",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    fontFamily: "CodecPro-ExtraBold",
    width: 180,
    borderBottomColor: "#4E3CBB",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    marginBottom: 40,
    marginTop: 30,
    fontSize: 20,
    color: "#4E3CBB",
    textAlign: "center",
  },

  buttonClose: {
    backgroundColor: "#EB1194",
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  buttonChosePicture:{
    backgroundColor: "#4E3CBB",
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    fontSize: 22,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  textStyleChoose:{
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 15,//ou 14 ? 
  },
  personIconContainer: {
    backgroundColor: "#4E3CBB33",
    padding: 5,
    borderRadius: 50,
    marginRight: 10,
  },
  paymentCTAContainer: {
    backgroundColor: "#EB1194",
    paddingHorizontal: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "absolute",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  closeImage:{
  color: '#4E3CBB',
  fontFamily: "CodecPro-ExtraBold",
  },
  image: {
    width: 250,
    height: 450,
    marginBottom: 20,
  },
});
// coucou petite peruche