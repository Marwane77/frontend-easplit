import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import user from "./reducers/user.js";
import event from "./reducers/event.js";

//Librairie Ionicons :
import Icon from "react-native-vector-icons/Ionicons";
//Sinda : import de mon composant svgChampagne qui correspond à l'icone des verres de champ' :
import SvgChampagne from "./components/SvgChampagne.js";
import PlusButton from "./components/plusButton.js";
//Sinda : ajout pour pouvoir utiliser des dégradés : faire un yarn add expo-linear-gradient ou yarn install
import { LinearGradient } from "expo-linear-gradient";
//Sinda : ajout module expo-font pour utiliser la Codec pro : faire un yarn add expo-font ou yarn install
import * as Font from "expo-font";
import { useFonts } from "expo-font";
import { useState, useEffect } from "react";

import { Provider } from "react-redux";

// A la fin: import du persiststrore
//import { persistStore, persistReducer } from "redux-persist";
//import AsyncStorage from "@react-native-async-storage/async-storage";
//import { PersistGate } from "redux-persist/integration/react";
import { configureStore } from "@reduxjs/toolkit";

// import des écrans de navigation
import SigninScreen from "./screens/SigninScreen";
import SignUpScreen from "./screens/SignUpScreen.js";
import HomeScreen from "./screens/HomeScreen";

import EventsListScreen from "./screens/EventsListScreen.js";
import EventScreen from "./screens/EventScreen";
import CreatEventScreen from "./screens/CreatEventScreen.js";
import SuccessScreen from "./screens/SuccessScreen.js";

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

// const persistConfig = {
//   key: "easplit",
//   storage: AsyncStorage,
// };

// const reducers = combineReducers({ user });

const store = configureStore({ reducer: { user, event} });

//const persistor = persistStore(store);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//Contenu de la tabBar :
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            // Icône pour Home via Ionicons
            return <Icon name="home-sharp" size={size} color={color} />;
          } else if (route.name === "EventsList") {
            // Icône pour Event via le component
            return <SvgChampagne width={size} height={size} fill={color} />;
          } else if (route.name === "CreateEvent") {
            return <PlusButton width={size} height={size} />;
          }
        },
        tabBarActiveTintColor: "#EB1194", // le rose
        tabBarInactiveTintColor: "#4E3CBB", // le violet
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CreateEvent" component={CreatEventScreen} />
      <Tab.Screen name="EventsList" component={EventsListScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  // import des polices

  const [fontsLoaded, fontError] = useFonts({
    "CodecPro-Regular": require("./assets/fonts/CodecPro-Regular.ttf"),
    "CodecPro-ExtraBold": require("./assets/fonts/CodecPro-ExtraBold.ttf"),
    "CodecPro-Heavy": require("./assets/fonts/CodecPro-Heavy.ttf"),
  });

  // Si le hook useFonts n'a pas eu le temps de charger les polices, on return null pour éviter de faire crasher l'app.
  if (!fontsLoaded || fontError) {
    return null;
  }

  return (
    <Provider store={store}>
      {/* // <PersistGate persistor={persistor}> */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Signin" component={SigninScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Event" component={EventScreen} />
          <Stack.Screen name="CreateEvent" component={CreatEventScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* // </PersistGate> */}
    </Provider>
  );
}
