import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GuestInput = ({ onAddGuest }) => {
  const [email, setEmail] = useState('');

  const handleAddGuest = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && emailRegex.test(email)) {
      const emailLowercase = email.toLowerCase();
      onAddGuest({ email: emailLowercase, parts: 1 });
      setEmail('');
    } else {
      console.log('Invalid email');
    }
  };

  return (
    <View style={[styles.inputWrapper, styles.shadowAndroid]}>
      <View style={styles.inputContainer}>
      
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
        />
      </View>
      <TouchableOpacity onPress={handleAddGuest}>
        <Ionicons name="add-circle" size={45} color="#EB1194" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 20,
    marginHorizontal: 10,
    backgroundColor: "#f4f3ff",
    borderRadius: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
    alignItems: "center",
  },
  inputField: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 16,
    color: '#4E3CBB',
    paddingRight: 0,
    fontFamily: "CodecPro-Regular",
    marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
  },
  shadowAndroid: {
    elevation: 6,
  },
  shadowIOS: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
});

export default GuestInput;