import {
  View,
  Platform,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { addBalance, updateFirstName } from "../reducers/user";
import Icon from "react-native-vector-icons/Ionicons";
import DropdownMenu from "../components/DropdownMenu";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view"; //pour nom en gradient
import LastTransactions from "../components/LastTransaction";
import globalStyles from "../styles/globalStyles"; //Appel des styles globaux
import { getUserEvents } from "../utils/getUserEvents";
import React, { useState, useEffect } from "react";
import { PATH } from "../utils/path";
import { useFocusEffect } from "@react-navigation/native"; //useFocusEffect permet de recharger les événements de l'utilisateur connecté à chaque fois que l'utilisateur revient sur la page
import { BlurView } from "expo-blur"; // Import du BlurView

export default function HomeScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  //console.log('reducerUser' + user)

  //ajout du state de la modal
  const [modalVisible, setModalVisible] = useState(false);
  //ajout du setter pour la balance lors de la modal
  const [balance, setBalance] = useState("");

  // Déclaration de la liste des événements de l'utilisateur connecté
  const [eventsList, setEventsList] = useState([]);
  //  fetch des événements de l'utilisateur connecté
  const fetchEvents = () => {
    fetch(`${PATH}/events/user-events/${user.token}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setEventsList(data.events);
        }
      });
  };

  // FocusEffect permet de recharger les événements de l'utilisateur connecté à chaque fois que l'utilisateur revient sur la page
  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [])
  );

  const handleModalClose = () => {
    setModalVisible(false);
    setBalance(""); // Réinitialise le placeholder à chaque validation
  };

  const [displayBalance, setDisplayBalance] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  useEffect(() => {
    setDisplayBalance(userBalance);
  }, [userBalance]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`${PATH}/users/getbalance/${user.token}`);
        if (response.ok) {
          const data = await response.json();
          setUserBalance(data.balance);
        } else {
          console.error("Failed to fetch balance");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchBalance();
  }, []);

  const handleRecharge = async () => {
    const rechargeAmount = Number(balance);

    const requestBody = {
      emitter: user.token, // Utiliser le token de l'utilisateur comme émetteur
      recipient: user.token, // Le destinataire est le même que l'émetteur dans ce cas
      type: "reload",
      amount: rechargeAmount,
    };

    try {
      const response = await fetch(
        `${PATH}/transactions/reload/${user.token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();

        dispatch(addBalance(rechargeAmount));

        setUserBalance((prevBalance) => prevBalance + rechargeAmount);

        setBalance("");
      } else {
        console.error("Failed to update balance");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Close the modal
    setModalVisible(false);
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
        showsVerticalScrollIndicator={false}
      >
        {/* // garder le click sans devoir fermer le keyboard */}
        <View>
          <View style={styles.headerContainer}>
            <Image
              source={require("../assets/EASPLIT-NOIR.png")}
              style={styles.logo}
            />
            <DropdownMenu />
          </View>

          <MaskedView
            style={{ flexDirection: "row" }}
            maskElement={
              <Text style={styles.titleText}>Bonjour {user.firstName}</Text>
            }
          >
            <LinearGradient
              colors={["#EB1194", "#4E3CBB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.linearGradient}
            />
          </MaskedView>

          <Text style={styles.titleList}>MON SOLDE</Text>
          <View style={styles.underline} />

          <View style={styles.View}>
            <View style={styles.balanceContainer}>
              <Text style={styles.textBalanceContainer}>
                {user.balance ? user.balance.toFixed(2) : "0.00"}€
              </Text>
            </View>
          </View>
          <View style={styles.reloadButton}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={globalStyles.buttonContainer}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#EB1194", "#4E3CBB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={globalStyles.gradientBackground}
              >
                <View style={globalStyles.textContainer}>
                  <Text style={styles.reloadbuttonText}>Recharger</Text>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <BlurView intensity={60} style={styles.absolute}>
                      <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                          <Text style={styles.modalText}>
                            Montant du rechargement
                          </Text>
                          <TextInput
                            placeholder="Montant €"
                            autoCapitalize="none"
                            keyboardType="number"
                            textContentType="number"
                            onChangeText={(value) => setBalance(value)}
                            value={balance}
                            style={styles.input}
                            placeholderTextColor="#b5b5b5"
                          />
                          <TouchableOpacity
                            style={globalStyles.buttonContainer}
                            activeOpacity={0.8}
                            onPress={handleRecharge}
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
                            onPress={handleModalClose}
                          >
                            <Text style={styles.closeButtonText}>Fermer</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </BlurView>
                  </Modal>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate("Signin");
              }}
            ></TouchableOpacity>
          </View>

          <Text style={styles.titleList2}>MES DERNIERES TRANSACTIONS</Text>
          <LastTransactions />

          <Text style={styles.titleList2}>MES DERNIERS EVENTS</Text>
          {eventsList &&
            eventsList.length > 0 &&
            [...eventsList]
              .reverse()
              .slice(0, 2)
              .map((event, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.newEventContainer}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate("Event", { eventId: event._id })
                  }
                >
                  <Text style={styles.eventName}>{event.name}</Text>
                </TouchableOpacity>
              ))}

          <TouchableOpacity
            style={styles.newEventContainer}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("EventsList")}
          >
            <Text style={styles.textAddingContainer}>voir plus</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    height: "100vh",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
  },
  title: {
    fontSize: 30,
    fontFamily: "CodecPro-ExtraBold",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  linearGradient: {
    borderRadius: 0,
    height: 40,
    marginTop: 30,
    width: "100%",
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    color: "white",
    marginTop: 30,
  },
  underline: {
    width: "100%", // Ajustez cette valeur pour la longueur de la ligne de soulignement
    borderBottomWidth: 1, // Épaisseur de la ligne de soulignement
    borderBottomColor: "black", // Couleur de la ligne de soulignement
    marginTop: 2, // Espace entre le texte et la ligne
    marginBottom: 5,
  },
  reloadButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
  },
  reloadbuttonText: {
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 20,
    color: "#FFFFFF",
  },
  buttonReload2: {
    color: "#EB1194",
  },
  titleList: {
    fontFamily: "CodecPro-ExtraBold",
    marginTop: 10,
    color: "#4E3CBB",
    fontSize: 20,
  },
  titleList2: {
    fontFamily: "CodecPro-ExtraBold",
    marginBottom: 0,
    color: "#4E3CBB",
    marginTop: 5,
    fontSize: 20,
  },
  View: {},
  balanceContainer: {
    backgroundColor: "#FFFFFF",
    color: "#4E3CBB",
    fontFamily: "CodecPro-Regular",
    marginBottom: 10,
    borderTopLeftRadius: 5.33,
    borderTopRightRadius: 5.33,
    padding: 10,
  },
  newEventContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  composantContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 25, //à supprimer surement apres ajout du module (pour estimer la place prise sur le screen)
    borderRadius: 10,
    marginBottom: 10,
  },
  textCurrentContainer: {
    color: "#4E3CBB",
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 24,
  },
  textBalanceContainer: {
    color: "#4E3CBB",
    fontFamily: "CodecPro-ExtraBold",
    textAlign: "center",
    fontSize: 28,
  },
  eventName: {
    color: "#4E3CBB",
    fontWeight: "bold",
  },
  textAddingContainer: {
    color: "#EB1194",
    fontWeight: "bold",
  },
  //css de la modal:
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
  modalText: {
    marginBottom: 0,
    fontFamily: "CodecPro-ExtraBold",
    color: "#4E3CBB",
    fontSize: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 20,
    textAlign: "center",
  },
  closeButtonText: {
    fontFamily: "CodecPro-Regular",
    fontSize: 16,
    marginTop: 5,
    height: 32, // container dans react native ne s'adapte pas toujours au contenu
  },
  input: {
    fontFamily: "CodecPro-ExtraBold",
    width: 180,
    borderBottomColor: "#4E3CBB",
    alignItems: "center", // fonctionne maintenant
    justifyContent: "center", // fonctionne maintenant
    borderBottomWidth: 1,
    marginBottom: 40,
    marginTop: 30,
    fontSize: 20,
    color: "#4E3CBB",
    textAlign: "center",
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  buttonContainer: {
    display: "flex",
    width: 180,
    marginTop: 8,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
