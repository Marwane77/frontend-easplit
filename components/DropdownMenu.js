import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { logout } from '../reducers/user';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogOut = () => {
    dispatch(logout());
    navigation.navigate("Signin");
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.burgerIcon}>
        <Ionicons name={isOpen ? 'close' : 'menu'} size={30} color="#4E3CBB" />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.menu}>
          <Text style={styles.menuItem}>Profil</Text>
          <Text style={styles.menuItem}>Paramètres</Text>
          <Text style={styles.menuItem}>Mentions légales</Text>
          <TouchableOpacity onPress={handleLogOut}>  
          <Text style={[styles.menuItem,styles.logout]}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999, 
  },
  burgerIcon: {
    padding: 10,
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 20,
    paddingHorizontal: 25,
    elevation: 3,
  },
  menuItem: {
    paddingTop: 10,
    paddingBottom:5,
    fontSize:16,
    color:"#4E3CBB",
    fontFamily: "CodecPro-Regular",
    borderBottomWidth:1,
    borderBottomColor:"#f4f3ff",

  },
  logout:{
    color:"#EB1194",
    fontFamily: "CodecPro-ExtraBold",
    marginTop:30,
  }
});

export default DropdownMenu;