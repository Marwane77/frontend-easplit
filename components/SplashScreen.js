import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import LottieView from 'lottie-react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const SplashScreenComponent = ({ onFinish }) => {
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Démarrer l'effet de fondu après 3 secondes
    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 3000);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image source={require('../assets/splash.png')} style={styles.image} />
      <LottieView 
        source={require('../assets/animation.json')} 
        autoPlay 
        loop 
        style={styles.lottie} 
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // back blanc
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  lottie: {
    width: 200,
    height: 200,
  },
});

export default SplashScreenComponent;
