import {
  View,
  Platform,
  Text,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { StyleSheet } from "react-native";
import globalStyles from "../styles/globalStyles"; //Appel des styles globaux
import React, { useState } from "react";
import MaskedView from "@react-native-masked-view/masked-view";
//Import de Linear-Gradient pour le dégradé
import { LinearGradient } from "expo-linear-gradient";
//Lottie Filles mais ne marche pas
// import LottieView from "lottie-react-native";
// import Confettis from '../assets/Confettis.json';

export default function SuccessScreen({ navigation }) {
  //3.RETURN FINAL
  return (
    <LinearGradient
      colors={["white", "#CAD1E0"]}
      start={[0.2, 0.2]}
      end={[0.8, 0.8]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.successContainer}>
          <MaskedView
            style={{ flexDirection: "row" }}
            maskElement={<Text style={styles.titleText}>Félicitation !</Text>}
          >
            <LinearGradient
              colors={["#EB1194", "#4E3CBB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.linearGradient}
            />
          </MaskedView>
          <Text style={[styles.succesText, globalStyles.violet]}>
            Votre évènement a bien été créé :D
          </Text>
          <Image
                  source={require('../assets/confettis-gif.gif')}
                  style={styles.animation}
                />
          <TouchableOpacity
            onPress={() => navigation.navigate("EventsList")}
            style={styles.buttonContainer}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#EB1194", "#4E3CBB"]} //Gradient rose vers violet
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            >
              <View style={styles.textContainer}>
                <Text style={styles.buttonText}>
                  La liste de mes évènements
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    alignItems: "center",
    height: 100,
    paddingTop: 8,
    width: "100%",
    marginTop: 30,
    backgroundColor: "#fbe29c",
    borderRadius: 1,
  },

  buttonContainer: {
    minHeight: 40,
    width: "100%",
    display: "flex",
    backgroundColor: "transparent",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  gradientBackground: {
    flex: 1,
    borderRadius: 10,
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  successContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    height: 100,
    width: 300,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "CodecPro-ExtraBold",
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  linearGradient: {
    height: 50,
    width: "100%",
  },
  titleText: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    marginTop: 0,
  },
  succesText: {
    color: "",
    fontSize: 18,
    width: 250,
    textAlign: "center",
    fontFamily: "CodecPro-Regular",
    opacity: 0.7,
    lineHeight: 28,
    letterSpacing: 0.15,
    marginTop: 15,
    marginBottom: 60,
  },
  animation: {
    position:"absolute",
    width: 200,
    height: 200,
  },
});
