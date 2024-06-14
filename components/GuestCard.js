import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

const GuestCard = ({ guest, onRemoveGuest, onUpdateParts }) => {
  const [parts, setParts] = useState(guest.parts);

  const handleAddPart = () => {
    const newParts = parts + 1;
    setParts(newParts);
    onUpdateParts(guest, newParts);
  };

  const handleRemovePart = () => {
    if (parts > 1) {
      const newParts = parts - 1;
      setParts(newParts);
      onUpdateParts(guest, newParts);
    }
  };

  return (
    <View style={[styles.cardWrapper, styles.shadowAndroid]}>
      <View style={styles.infoContainer}>
        <Text style={styles.guestName}>
          {guest.name}
          </Text>
        <Text style={styles.guestEmail}>
          {guest.email}
          </Text>
      </View>
      <View style={styles.partsContainer}>
        <TouchableOpacity onPress={handleRemovePart}>
          <Ionicons name="remove-circle" size={24} color="#EB1194" />
        </TouchableOpacity>
        <Text style={styles.partsText}>{parts}</Text>
        <TouchableOpacity onPress={handleAddPart}>
          <Ionicons name="add-circle" size={24} color="#EB1194" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => onRemoveGuest(guest)} style={styles.removeButton}>
        <Ionicons name="close-circle" size={24} color="#EB1194" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    padding: 20,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  infoContainer: {
    width: '100%',
  },
  guestName: {
    fontSize: 16,
    color: '#4E3CBB',
    fontFamily: 'CodecPro-Regular',
  },
  guestEmail: {
    fontSize: 14,
    color: '#4E3CBB',
    fontFamily: 'CodecPro-Regular',
  },
  partsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partsText: {
    fontSize: 16,
    color: '#4E3CBB',
    marginHorizontal: 10,
    fontFamily: 'CodecPro-Regular',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
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

export default GuestCard;