import React, { useState, useEffect } from 'react';
import {
  View,
  Platform,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import Input from '../components/Input';
import DropdownMenu from '../components/DropdownMenu';
import GuestInput from '../components/GuestInput';
import GuestCard from '../components/GuestCard';
import MaskedView from '@react-native-masked-view/masked-view';
import globalStyles from '../styles/globalStyles';
import { PATH } from '../utils/path.js';

// const PATH = "http://192.168.42.130:3000"
// const PATH = "http://localhost:3000";
// const PATH = "https://easplit-backend.vercel.app";

export default function CreateEventScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [deadLine, setDeadLine] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  const [participants, setParticipants] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amountPerPart, setAmountPerPart] = useState(0);

  const [localTotalAmount, setLocalTotalAmount] = useState('');

  const [errors, setErrors] = useState({});


  // Le UseEffect permet de mettre à jour en temps réel les montants à chaque changement
  useEffect(() => {
    const totalParts = participants.reduce((acc, curr) => acc + curr.parts, 0);
    if (totalAmount && totalParts > 0) {
      const newAmountPerPart = totalAmount / totalParts;
      if (newAmountPerPart !== parseFloat(amountPerPart)) {
        setAmountPerPart(newAmountPerPart.toFixed(2));
      }
    } else if (amountPerPart && totalParts > 0) {
      const newTotalAmount = amountPerPart * totalParts;
      if (newTotalAmount !== parseFloat(totalAmount)) {
        setTotalAmount(newTotalAmount.toFixed(2));
      }
    }
  }, [totalAmount, amountPerPart, participants,]);

  //useEffect qui ajoute automatiquement l'organisateur dans les participants au chargement de la page:
  useEffect(() => {
    if (user) {
      handleAddParticipant({
        name: user.firstName,
        email: user.email,
        parts: 1,
      });
    }
  }, [user]);

  // handleAddParticipant permet d'ajouter un participant à la liste des participants
  const handleAddParticipant = (participant) => {
    const participantEmailLowercase = participant.email.toLowerCase();
    if (!participants.some(p => p.email.toLowerCase() === participantEmailLowercase)) {
      setParticipants([...participants, { ...participant, email: participantEmailLowercase }]);
    }
  };


  const handleRemoveParticipant = (participantToRemove) => {
    const updatedParticipants = participants.filter(
      (participant) => participant !== participantToRemove
    );
    setParticipants(updatedParticipants);
  };

  const handleUpdateParts = (guest, parts) => {
    const updatedParticipants = participants.map((participant) => {
      if (participant.email === guest.email) {
        return { ...participant, parts };
      }
      return participant;
    });
    setParticipants(updatedParticipants);
  };

  // Gestion des erreurs et des dates :

  const handleEventDateChange = (value) => {
    setEventDate(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDateObj = new Date(value);
    eventDateObj.setHours(0, 0, 0, 0);
    if (eventDateObj < today) {
      setErrors((prev) => ({ ...prev, eventDate: "La date de l'événement ne peut pas être antérieure à la date du jour." }));
    } else {
      setErrors((prev) => ({ ...prev, eventDate: null }));
    }
};

const handleDeadLineChange = (value) => {
    setDeadLine(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadLineObj = new Date(value);
    deadLineObj.setHours(0, 0, 0, 0);
    const eventDateObj = new Date(eventDate);
    eventDateObj.setHours(0, 0, 0, 0);
    if (deadLineObj < today) {
      setErrors((prev) => ({ ...prev, deadLine: "La date limite de paiement ne peut pas être antérieure à la date du jour." }));
    } else if (eventDateObj < deadLineObj) {
      setErrors((prev) => ({ ...prev, deadLine: "La date limite de paiement doit être antérieure à la date de l'événement." }));
    } else {
      setErrors((prev) => ({ ...prev, deadLine: null }));
    }
};
  // FIN : Gestion des erreurs et des dates :

  //Mécanique pour créer l'évènement :

  //Fonction Créer un évènement :
  const createEvent = async () => {
    try {
      const requestBody = {
        name: eventName,
        eventDate,
        paymentDate: deadLine,
        description: eventDesc,
        guests: participants.map((participant) => ({
          email: participant.email,
          parts: participant.parts,
          hasPaid: false,
        })),
        totalSum: parseFloat(totalAmount),
        shareAmount: parseFloat(amountPerPart),
      };
  
      console.log('Request body:', requestBody);
  
      const eventResponse = await fetch(`${PATH}/events/create-event/${user.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!eventResponse.ok) {
        throw new Error('Failed to create event');
      }
  
      const data = await eventResponse.json();
      console.log(data)

        console.log(participants)

      // 4. Rediriger vers une autre page, afficher un message de succès, etc.

      navigation.navigate('Success');
  
      console.log(participants)

    setEventName('');
    setEventDate('');
    setDeadLine('');
    setEventDesc('');
    setParticipants([]);
    setTotalAmount(0);
    setAmountPerPart(0);
    setLocalTotalAmount('');

  
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement :', error);
    }
  };
  
    const handleSubmitEvent = () => {
      if (!eventName || !eventDate || !deadLine || !eventDesc || participants.length === 0 || !totalAmount || !amountPerPart) {
        console.error('Veuillez remplir tous les champs avant de créer l\'événement');
        return;
      }

      if (!eventDate) {
        if (new Date(eventDate) < today) {
        errorsTemp.eventDate = 'La date de l\'événement ne peut pas être antérieure à la date du jour';
      }
    }

      if (!deadLine) {
        if (new Date(deadLine) < today) {
        errorsTemp.deadLine = 'La date limite de paiement ne peut pas être antérieure à la date du jour';
      } else if (new Date(deadLine) >= new Date(eventDate)) {
        errorsTemp.deadLine = 'La date limite de paiement doit être antérieure à la date de l\'événement';
      }
    }
    
      for (let participant of participants) {
        if (isNaN(Number(participant.parts))) {
          console.error('Invalid share amount for participant');
          return;
        }
      }
    
      createEvent();
    };

  return (
    <LinearGradient
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      colors={['white', '#CAD1E0']}
      start={[0.2, 0.2]}
      end={[0.8, 0.8]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 80, android: 60 })}
      >
        <View behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
              contentContainerStyle={styles.scrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.headerContainer}>
                <Image
                  source={require('../assets/EASPLIT-NOIR.png')}
                  style={styles.logo}
                />
                <DropdownMenu />
              </View>
              <MaskedView
                style={{ flexDirection: 'row' }}
                maskElement={
                  <Text style={styles.titleText}>Créer un évènement</Text>
                }
              >
                <LinearGradient
                  colors={['#EB1194', '#4E3CBB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.linearGradient}
                />
              </MaskedView>
              <Text
                style={[
                  globalStyles.titleList,
                  globalStyles.rose,
                  globalStyles.capital,
                ]}
              >
                Infos de l'évènement
              </Text>
              <View styles={styles.containerList}>
                <Text
                  style={[
                    globalStyles.inputLabel,
                    globalStyles.capital,
                    styles.margin,
                  ]}
                >
                  Nom de l'évènement
                </Text>
                <Input placeholder="Nom de l'évènement" 
                value={eventName}
                onChangeText={(value) => setEventName(value)}
                />
                <Text
                  style={[
                    globalStyles.inputLabel,
                    globalStyles.capital,
                    styles.margin,
                  ]}
                >
                  Date de l'évènement
                </Text>
                <Input
                value={eventDate}
                onChangeText={handleEventDateChange}
                placeholder="Date de l'évènement"
                isDate={true}
              />
              {errors.eventDate && <Text style={styles.errorText}>{errors.eventDate}</Text>}
                <Text
                  style={[
                    globalStyles.inputLabel,
                    globalStyles.capital,
                    styles.margin,
                  ]}
                  
                >
                  Date de limite de paiement
                </Text>
                <Input
                placeholder="Date limite de paiement"
                value={deadLine}
                onChangeText={handleDeadLineChange}
                isDate={true}
              />
                 {errors.deadLine && <Text style={styles.errorText}>{errors.deadLine}</Text>}
                <Text
                  style={[
                    globalStyles.inputLabel,
                    globalStyles.capital,
                    styles.margin,
                  ]}
                >
                  Description
                </Text>
                <Input placeholder="Description"
                value={eventDesc}
                onChangeText={(value) => setEventDesc(value)}
                 />
                <Text
                  style={[
                    globalStyles.titleList,
                    globalStyles.rose,
                    globalStyles.capital,
                  ]}
                >
                  Ajout des participants
                </Text>
                <GuestInput onAddGuest={handleAddParticipant} />
                {participants.map((participant, index) => (
                  <GuestCard
                    key={index}
                    guest={participant}
                    onRemoveGuest={handleRemoveParticipant}
                    onUpdateParts={handleUpdateParts}
                  />
                ))}
                <Text
                  style={[
                    globalStyles.inputLabel,
                    globalStyles.capital,
                    styles.margin,
                  ]}
                >
                  Montant Total en €
                </Text>
                <TextInput
  style={[styles.input, styles.amount]}
  placeholder=""
  keyboardType="numeric"
  value={localTotalAmount}
  onChangeText={(text) => {
    if (text === '') {
      setLocalTotalAmount('');
      setTotalAmount('');
      setAmountPerPart('');
      return;
    }
    if (text.includes('.') && text.split('.')[1].length > 2) {
      return;
    }
    if (!isNaN(text)) {
      setLocalTotalAmount(text);
      setTotalAmount(parseFloat(text));
    }
  }}
/>
<Text
                  style={[
                    globalStyles.inputLabel,
                    globalStyles.capital,
                    styles.margin,
                  ]}
                >
                  Montant Par Part en €
                </Text>
<TextInput
  style={[styles.input, styles.amount]}
  placeholder=""
  keyboardType="numeric"
  value={amountPerPart}
  onChangeText={(text) => {
    if (text === '') {
      setAmountPerPart('');
      return;
    }
    if (text.includes('.') && text.split('.')[1].length > 2) {
      return;
    }
    if (!isNaN(text)) {
      setAmountPerPart(text);
    }
  }}
/>
                <TouchableOpacity
                  style={styles.buttonContainer}
                  activeOpacity={0.8}
                  onPress={handleSubmitEvent}
                >
                  <LinearGradient
                    colors={['#EB1194', '#4E3CBB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={globalStyles.gradientBackground}
                  >
                    <View style={styles.textContainer}>
                      <Text style={styles.buttonText}>Créer l'évènement</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
        
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  scrollview: {},
  margin: {
    marginHorizontal: 10,
  },
  buttonContainer: {
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 10,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'CodecPro-ExtraBold',
    lineHeight: 28,
    letterSpacing: 0.15,
  },
  linearGradient: {
    borderRadius: 0,
    height: 40,
    marginTop: 30,
    width: '100%',
  },
  titleText: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    marginTop: 30,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor:"#f4f3ff",
    color: '#4E3CBB',
    paddingTop:10,
    paddingRight: 20,
    fontFamily: "CodecPro-Regular",
    marginBottom: 10,
    marginHorizontal:10,
    borderTopLeftRadius: 5.33,
    borderTopRightRadius: 5.33,
  },
  amount:{
    fontSize: 30,
    fontFamily: "CodecPro-ExtraBold",
    textAlign:"right",
  },
  errorText: {
    color: 'red',
    marginHorizontal: 10,
    marginTop: -10,
    marginBottom: 10,
    fontFamily: "CodecPro-Regular",
  },
});