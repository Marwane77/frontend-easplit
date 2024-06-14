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
import { useSelector, useDispatch } from "react-redux";
import { login } from "../reducers/user";
import React, { useState } from "react";
import { PATH } from "../utils/path";
//Import de Linear-Gradient pour le dégradé
import { LinearGradient } from "expo-linear-gradient";

export default function SigninScreen({ navigation }) {
  //1.Déclaration des états et imports reducers si besoin
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);

  //2.Comportements
  const handleRegister = () => {
    fetch(`${PATH}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          setLoginErrorMessage(data.error);
        } else {
          //console.log("data renvoyée lors du login", data);
          dispatch(
            login({
              token: data.token,
              email: data.email,
              firstName: data.firstName,
              balance: data.balance,
              userId: data.userId,
            })
          );

          navigation.navigate("TabNavigator", {
            screen: "EventsListScreen",
          });
          setEmail('');
          setPassword('');
          setLoginErrorMessage(null);
        }
      });
  };

  //3.RETURN FINAL
  return (
    // composant linear gradient qui permet d'avoir le fond en dégradé : doit tout envelopper
    <LinearGradient
      colors={["white", "#CAD1E0"]} //Gradient blanc vers bleu
      start={[0.2, 0.2]}
      end={[0.8, 0.8]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Image
          source={require("../assets/EASPLIT-NOIR.png")}
          style={styles.logo}
        />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="off"
            onChangeText={(value) => setEmail(value)}
            value={email}
            style={styles.input}
          />
          <TextInput
            placeholder="mot de passe"
            autoCapitalize="none"
            textContentType="password"
            secureTextEntry={true} // Masque le texte d'entrée
            onChangeText={(value) => setPassword(value)}
            value={password}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => handleRegister()}
            style={styles.buttonContainer}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#EB1194", "#4E3CBB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            >
              <View style={styles.textContainer}>
                <Text style={styles.buttonText}>C'est parti !</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {loginErrorMessage && (
            <Text style={styles.error}>{loginErrorMessage}</Text>
          )}
          <Text style={styles.noaccount}>Pas encore de compte?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
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
                <Text style={styles.buttonText}>Créer un compte</Text>
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
  // style du bouton :
  buttonContainer: {
    display: "flex",
    width: 180,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 10,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  textContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 13,
    fontFamily: "CodecPro-ExtraBold",
    // fontWeight:"600",
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  // fin du style du bouton
  logo: {
    flex: 0.18,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "contain",
    marginBottom: 70,
  },

  inputContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 10,
  },

  input: {
    fontFamily: "CodecPro-Regular",
    width: 180,
    borderBottomColor: "#b5B5B5",
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 16,
  },

  textButton: {
    fontFamily: "CodecPro-Regular",
    height: 30,
    fontSize: 12,
  },
  error: {
    marginTop: 10,
    color: "red",
  },
  noaccount: {
    fontFamily: "CodecPro-Regular",
    fontSize: 16,
    paddingTop: 30,
    paddingBottom: 10,
  },
});
