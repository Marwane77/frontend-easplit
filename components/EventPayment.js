import { StyleSheet } from "react-native";
import globalStyles from "../styles/globalStyles";
import Icon from "react-native-vector-icons/Ionicons";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PATH } from "../utils/path";
import { downBalance } from "../reducers/user";

export default function EventPayment({ expenses, event, navigation, eventId }) {
  const user = useSelector((state) => state.user.value);
  //console.log(user.balance);
  const dispatch = useDispatch();
  const [currentEvent, setCurrentEvent] = useState(event);
  const [errorMessage, seterrorMessage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );
  const currentUser = currentEvent.guests.find(
    (guest) =>
      guest.userId.email === user.email &&
      guest.userId.firstName === user.firstName
  );

  const otherGuests = currentEvent.guests.filter(
    (guest) =>
      guest.userId.email !== user.email &&
      guest.userId.firstName !== user.firstName
  );

  useEffect(() => {
    if (errorMessage) {
      setIsModalVisible(true);
    }
  }, [errorMessage]);

  const handleCloseModal = () => {
    seterrorMessage(null);
    setIsModalVisible(false);
  };
  const handlePayment = () => {
    fetch(
      `${PATH}/transactions/create/payment/${user.token}/${event.eventUniqueId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "payment",
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          seterrorMessage(data.error);
        } else {
          dispatch(downBalance(data.transactionSaved.amount));
          //   console.log(
          //     "test EventPayment transactionSaved.amount:",
          //     data.transactionSaved.amount
          //   );
          //   console.log("test user.balance", user.balance);
          fetch(`${PATH}/events/event/${eventId}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.result) {
                setCurrentEvent(data.event);
              }
              //console.log("EventPayment", data.event);
            });
        }
      });
  };

  return (
    <ScrollView
      style={styles.scrollView} // Ajouté pour s'assurer que le ScrollView a un style
      contentContainerStyle={{ paddingVertical: 20 }} // Ajouté pour ajouter un padding vertical
      showsVerticalScrollIndicator={true}
    >
      <View>
        <Text
          style={[
            globalStyles.titleList,
            globalStyles.violet,
            globalStyles.capital,
            { marginTop: 20 },
          ]}
        >
          RÉCAPITULATIF DES FONDS
        </Text>

        <View
          style={[
            styles.RecapEventCard,
            Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
          ]}
        >
          <View style={{ ...styles.recapCardRow, margin: 7 }}>
            <Text style={styles.textCurrentListCard}>Budget initial</Text>
            <Text style={styles.textPaymentRecapLeft}>{event.totalSum}€</Text>
          </View>
          <View style={{ ...styles.recapCardRow, margin: 7 }}>
            <Text style={styles.textCurrentListCard}>
              Nombre de participants
            </Text>
            <Text style={styles.textPaymentRecapLeft}>
              {event.guests.length}
            </Text>
          </View>
          <View style={{ ...styles.recapCardRow, margin: 7 }}>
            <Text style={styles.textCurrentListCard}>Total des dépenses</Text>
            <Text style={styles.textPaymentRecapLeft}>{totalExpenses}€</Text>
          </View>
        </View>

        <Text
          style={[
            globalStyles.titleList,
            globalStyles.violet,
            globalStyles.capital,
          ]}
        >
          STATUT DES RÉGLEMENTS
        </Text>
        {/* <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        > */}
        <View>
          {currentUser && (
            <View
              style={[
                styles.listCard,
                Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
                styles.currentUserCard,
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.personIconContainer}>
                  <Icon name="person" size={20} color="#4E3CBB"></Icon>
                </View>
                <Text
                  style={[styles.textCurrentListCard, styles.currentUserText]}
                >
                  MOI
                </Text>
              </View>

              {currentUser.hasPaid ? (
                <Icon name="checkmark-circle" size={25} color="#EB1194" />
              ) : (
                <View>
                  <TouchableOpacity
                    onPress={() => handlePayment()}
                    style={styles.paymentCTAContainer}
                    activeOpacity={0.8}
                  >
                    <View>
                      <Text style={globalStyles.buttonText}>Participer</Text>
                    </View>
                  </TouchableOpacity>
                  {errorMessage && (
                    <Modal
                      isVisible={isModalVisible}
                      animationType="slide"
                      transparent={true}
                      onRequestClose={handleCloseModal}
                    >
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <Text style={styles.error}>{errorMessage}</Text>
                          <TouchableOpacity
                            style={globalStyles.buttonContainer}
                            activeOpacity={0.8}
                            onPress={() => navigation.navigate("Home")}
                          >
                            <LinearGradient
                              colors={["#EB1194", "#4E3CBB"]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={globalStyles.gradientBackground}
                            >
                              <View style={globalStyles.textContainer}>
                                <Text style={styles.reloadbuttonText}>
                                  Je recharge
                                </Text>
                              </View>
                            </LinearGradient>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.buttonContainer}
                            activeOpacity={0.8}
                            onPress={handleCloseModal}
                          >
                            <Text style={styles.closeButtonText}>Fermer</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                  )}
                </View>
              )}
            </View>
          )}

          {otherGuests.map((guest, i) => (
            <View
              key={i}
              style={[
                styles.listCard,
                Platform.OS === "ios" ? styles.shadowIOS : styles.shadowAndroid,
              ]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.personIconContainer}>
                  <Icon name="person" size={20} color="#4E3CBB"></Icon>
                </View>
                <View>
                  <Text style={styles.textCurrentListCard}>
                    {guest.userId.firstName}
                  </Text>
                  <Text style={styles.textSmallCurrentListCard}>
                    {guest.userId.email}
                  </Text>
                </View>
              </View>

              {guest.hasPaid ? (
                <Icon name="checkmark-circle" size={25} color="#EB1194" />
              ) : (
                <Icon name="checkmark-circle" size={25} color="#4E3CBB33" />
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  //MAINS CONTAINERS
  scrollView: {
    // flex:1,
    marginBottom: 20,
    // backgroundColor: "white",
  },
  //   participer: {
  //     height: 25,
  //   },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
  },
  // ELEMENT RAPPORTE
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  // EVENTS CONTAINER
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
  recapCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  RecapEventCard: {
    paddingHorizontal: 20,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 20,
    height: 150,
    marginHorizontal: 10,
  },
  // TEXTES
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
    marginBottom: 10,
    color: "red",
  },
  reloadbuttonText: {
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 16,
    color: "#fff",
  },
  //CSS de la modal
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

  // AUTRES
  personIconContainer: {
    backgroundColor: "#4E3CBB33",
    padding: 5,
    borderRadius: 50,
    marginRight: 10,
  },
  paymentCTAContainer: {
    backgroundColor: "#EB1194",
    // paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
