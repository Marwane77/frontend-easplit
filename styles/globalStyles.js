// globalStyles.js
import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  // container de chaque page
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30,
  },
  // style du bouton type Submit/Signin:
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
    fontSize: 14,
    fontFamily: "CodecPro-ExtraBold",
    // fontWeight:"600",
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  // ???
  textButton: {
    fontFamily: "CodecPro-Regular",
    height: 30,
    fontSize: 12,
  },

  // Logo page accueil
  logo: {
    flex: 0.18,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "contain",
    marginBottom: 70,
  },
  //Style des inputs SignIn/SignUp
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

  // Les typos
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
  },

  titleList: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 15,
    color: "#4E3CBB",
  },

  inputLabel: {
    fontFamily: "CodecPro-ExtraBold",
    fontSize: 14,
    letterSpacing: 0.5,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 5,
    marginTop: 15,
    color: "#4E3CBB",
  },

  capital: {
    textTransform: "uppercase",
  },

  //   Style des erreurs
  error: {
    marginTop: 10,
    color: "red",
  },
  // couleurs:

  violet: {
    color: "#4E3CBB",
  },
  rose: {
    color: "#EB1194",
  },
  bleuclair: {
    color: "#f4f3ff",
  },

  //   noaccount: {
  //     paddingTop: 30,
  //     paddingBottom: 10,
  //   },
  //   textRegular: {
  //     fontFamily: 'CodecPro-Regular', // Assurez-vous que votre police est chargée dans App.js
  //     fontSize: 16,
  //   },
  //   container: {
  //     flex: 1,
  //     padding: 20,
  //   },
  //   buttonGradient:{

  //   }
  // Ajoutez plus de styles globaux ici
});

export default globalStyles;
