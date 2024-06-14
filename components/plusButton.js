import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const PlusButton = () => {
  return (
    <View style={styles.container}>
      <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={[styles.svg, styles.shadow]}>
        <Defs>
          <LinearGradient id="gradient" x1="-4.2075" y1="-4.7975" x2="436.7925" y2="437.2025" gradientUnits="userSpaceOnUse">
            <Stop offset="0.1303" stopColor="#EB1194" />
            <Stop offset="1" stopColor="#4E3CBB" />
          </LinearGradient>
        </Defs>
        <Circle cx="256" cy="256" r="256" fill="url(#gradient)" />
        <Path d="M256,361c-5.8,0-10.5-4.7-10.5-10.5v-84h-84c-5.8,0-10.5-4.7-10.5-10.5c0-5.8,4.7-10.5,10.5-10.5h84v-84
        c0-5.8,4.7-10.5,10.5-10.5c5.8,0,10.5,4.7,10.5,10.5v84h84c5.8,0,10.5,4.7,10.5,10.5c0,5.8-4.7,10.5-10.5,10.5h-84v84
        C266.5,356.3,261.8,361,256,361z" fill="#FFFFFF" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -20 }],
  },
  svg: {
    width: 60,  // Augmenter la largeur pour donner plus de place à l'ombre
    height: 60,  // Augmenter la hauteur pour donner plus de place à l'ombre
  },
  shadow: {
    shadowColor: '#EB1194',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    margin: 10,  // Ajouter une marge pour éviter que l'ombre soit coupée
    backgroundColor: 'rgba(235, 17, 148, 0.2)',
    borderRadius: 30,  // Ajouter un rayon de bordure pour rendre le conteneur circulaire
  },
});

export default PlusButton;
