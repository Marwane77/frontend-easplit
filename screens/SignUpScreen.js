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
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { login } from "../reducers/user";
import { PATH } from "../utils/path";
//Import de Linear-Gradient pour le dégradé
import { LinearGradient } from "expo-linear-gradient";

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function SignUpScreen({ navigation }) {
  //1.Déclaration des états et imports reducers si besoin
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isWrongEmailFormat, setIsWrongEmailFormat] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);

  //2.Comportements
  const handleSubmit = () => {
    if (EMAIL_REGEX.test(email)) {
      fetch(`${PATH}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("signUP result:", data);
          if (!data.result) {
            setLoginErrorMessage(data.error);
          } else {
            const signUpUser = data.data;
            //console.log(signUpUser);
            dispatch(
              login({
                firstName: signUpUser.firstName,
                lastName: signUpUser.lastName,
                email: signUpUser.email,
                balance: signUpUser.balance,
                token: signUpUser.token,
                userId: signUpUser.userId,
              })
            );
            navigation.navigate("TabNavigator", { screen: "EventsListScreen" });
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setIsWrongEmailFormat(false);
            setLoginErrorMessage(null);
          }
        });
    } else {
      setIsWrongEmailFormat(true);
    }
  };

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
        <Image
          source={require("../assets/EASPLIT-NOIR.png")}
          style={globalStyles.logo}
        />
        <View style={globalStyles.inputContainer}>
          <TextInput
            placeholder="prénom"
            onChangeText={(value) => setFirstName(value)}
            value={firstName}
            style={globalStyles.input}
          />
          <TextInput
            placeholder="nom"
            onChangeText={(value) => setLastName(value)}
            value={lastName}
            style={globalStyles.input}
          />
          <TextInput
            placeholder="email"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="off"
            onChangeText={(value) => setEmail(value)}
            value={email}
            style={globalStyles.input}
          />
          {isWrongEmailFormat && (
            <>
              <Text style={globalStyles.error}>
                Le format de l'adresse email
              </Text>
              <Text style={globalStyles.error}>est incorrect</Text>
            </>
          )}
          <TextInput
            placeholder="mot de passe"
            autoCapitalize="none"
            secureTextEntry={true} //cache le mot de passe
            onChangeText={(value) => setPassword(value)}
            value={password}
            style={globalStyles.input}
          />
          {loginErrorMessage && (
            <Text style={globalStyles.error}>{loginErrorMessage}</Text>
          )}
          {/* <TouchableOpacity
          onPress={() => handleSubmit()}
          style={globalStyles.button}
          activeOpacity={0.8}
        >
          <LinearGradient
              colors={["#EB1194", "#4E3CBB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}>

          <Text style={globalStyles.textButton}>C'est parti!</Text>
              </LinearGradient>
        </TouchableOpacity> */}

          <TouchableOpacity
            onPress={() => handleSubmit()}
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
                <Text style={globalStyles.buttonText}>C'est parti !</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Signin");
            }}
          >
            <Text style={styles.existingAccount}>Compte déjà existant?</Text>
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
  title: {
    fontSize: 40,
    fontWeight: "600",
    fontFamily: "CodecPro-Regular",
    marginBottom: 20,
  },
  inputContainer: {
    width: "85%",
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 1,
  },
  input: {
    width: "100%",
    borderBottomColor: "#000000",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    alignItems: "center",
    paddingTop: 8,
    width: "100%",
    marginTop: 30,
    backgroundColor: "#fbe29c",
    borderRadius: 1,
  },
  textButton: {
    fontFamily: "CodecPro-Regular",
    height: 30,
    fontWeight: "600",
    fontSize: 16,
  },
  error: {
    marginTop: 10,
    color: "red",
  },
  existingAccount: {
    fontFamily: "CodecPro-Regular",
    fontSize: 16,
    paddingTop: 30,
  },
});
