import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const Input = (props) => {
  const { placeholder, label, secureTextEntry, isDate, value, onChangeText } = props;
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const showDatePicker = () => {
    setShow(true);
  };

  const onChangeDate = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      onChangeText(selectedDate.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).split('/').reverse().join('-'));//A changer pour format YYYY-MM-DD
    }
  };

  return (
    <View style={[styles.inputWrapper, Platform.OS === 'ios' ? styles.shadowIOS : styles.shadowAndroid]}>
      {!isDate ? (
        <TextInput
          style={styles.inputField}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="transparent"
        />
      ) : (
        <TouchableOpacity onPress={showDatePicker}>
          <TextInput
            style={styles.inputField}
            placeholder={placeholder}
            value={value}
            editable={false}
            placeholderTextColor="transparent"
          />
        </TouchableOpacity>
      )}
      <Text style={styles.inputLabel}>
        {label}
      </Text>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    position: 'relative',
    padding: 20,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  inputField: {
    borderBottomWidth: 1,
    borderBottomColor: '#f4f3ff',
    fontSize: 16,
    color: '#4E3CBB',
    paddingRight: 40,
    fontFamily: "CodecPro-Regular",
  },
  inputLabel: {
    position: 'absolute',
    paddingHorizontal: 20,
    top: 20,
    left: 0,
    fontSize: 14,
    color: '#4E3CBB',
    fontFamily: "CodecPro-Regular",
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

export default Input;