import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, Children } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { User } from './Interfaces/User';

export default function Index() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [currentQuest, setCurrentQuest] = useState<{ title: string, description: string, xp_reward: number } | null>(null);

  useEffect(() => {
    if (params.user) {
      setActiveUser(JSON.parse(params.user as string));
    }
  }, [params.user])

  const generateNewQuest = async () => {
    try {
      const response = await fetch('http://192.168.0.20:3000/get-quest');
      const data = await response.json();
      const randomQuest = data;
      setCurrentQuest(randomQuest);
    } catch (error) {
      alert("Proveri da li je server upaljen i IP adresa tačna!");
      console.error(error);
    }
  };

  const completeQuest = async () => {
    if (!activeUser || !currentQuest) return;

    const response = await fetch('http://192.168.0.20:3000/update-xp', { // UKLONJEN / NA KRAJU
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: activeUser.user_id,
        xpToAdd: currentQuest.xp_reward
      }),
    });
    const data = await response.json();

    if (response.ok) {
      setActiveUser({
        ...activeUser,
        xp_points: data.newXp,
        current_level: data.newLevel
      });

      if (data.levelUp) {
        Alert.alert("LEVEL UP! 🎉", `Sada si nivo ${data.newLevel}! Samo tako nastavi.`);
      } else {
        Alert.alert("Bravo!", `Dobio si ${currentQuest.xp_reward} XP!`);
      }
      setCurrentQuest(null);
    }
  };

  if (!activeUser) {
    return (
      <SafeAreaProvider style={styles.safeAreaProvider}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor="transparent"
          translucent={true}
        />
        <SafeAreaView style={styles.mainView}>
          <View style={styles.header}>
            <Text style={styles.title}>EdgeDaily</Text>
          </View>
          <View style={[styles.mainView, { alignItems: "center", justifyContent: "space-around" }]}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                router.push("/signin");
              }
              }
            ><Text style={{ color: theme.bg }}>Prijava</Text></TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const xpProgress = (activeUser.xp_points % 500) / 500;

  return (
    <SafeAreaProvider style={styles.safeAreaProvider}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={styles.mainView}>
        <View style={styles.header}>
          <Text style={styles.title}>EdgeDaily</Text>
          <TouchableOpacity onPress={() => setActiveUser(null)} style={{ marginTop: 20 }}>
            <Text style={[styles.button, { backgroundColor: theme.text, color: theme.bg }]}>Odjavi se</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainView}>
          <View style={styles.container}>
            <Text style={{ fontSize: 24, marginBottom: 14, fontWeight: 'bold' }}>Dobrodošao, {activeUser.username}!</Text>
            <Text style={{fontSize: 18}}>Level: <Text style={{color: theme.secondary, fontWeight: 'bold'}}>{activeUser.current_level}</Text></Text>
            <Progress.Bar 
              style={{ marginTop: 10, borderColor: theme.secondary }}
              color='#F96900'
              progress={xpProgress}
            />
          </View>
          <View >
            {!currentQuest ? (
              <TouchableOpacity
                style={styles.button}
                onPress={generateNewQuest}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Uzmi novi Quest!</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.container}>
                <Text style={{ fontSize: 18, marginVertical: 5, fontWeight: 'bold' }}>Aktivni Quest: {currentQuest.title}</Text>
                <Text style={{ marginVertical: 5 }}>{currentQuest.description}</Text>
                <Text style={{marginVertical: 5, fontStyle: "italic"}}>Nagrada: {currentQuest.xp_reward} XP</Text>

                <TouchableOpacity
                  style={[styles.button, {marginTop: 10}]}
                  onPress={completeQuest}
                >
                  <Text style={{ color: 'white', textAlign: 'center' }}>OZNAČI KAO ODRAĐENO</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const theme = {
  bg: "#FBF5F3",
  primary: "#4C956C",
  secondary: "#F96900",
  text: "#283044",
  shadow: "#E1DDDE",
  borderRadius: 12,
  boxShadow: '0px 2px 7px #E1DDDE'
}

const styles = StyleSheet.create({
  safeAreaProvider: {
    backgroundColor: theme.bg,
  },
  mainView: {
    margin: 14,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    backgroundColor: theme.primary,
    borderRadius: theme.borderRadius,
    boxShadow: theme.boxShadow
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    padding: 4
    // Dodati custom font ovde
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 28,
    marginVertical: 7,
    borderRadius: theme.borderRadius,
    boxShadow: theme.boxShadow
  }

});