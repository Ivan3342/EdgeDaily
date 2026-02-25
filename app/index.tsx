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

    const response = await fetch('http://192.168.0.20:3000/update-xp', {
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
          <TouchableOpacity
            onPress={() => setActiveUser(null)}
            style={{ marginTop: 20 }}>
            <Text style={[styles.button, { backgroundColor: theme.text, color: theme.bg }]}>Odjavi se</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.mainView}>
          <View style={styles.container}>
            <Text style={{ fontSize: 24, marginBottom: 14, fontWeight: 'bold' }}>Dobrodošao, {activeUser.username}!</Text>
            <Text style={{ fontSize: 18 }}>Level: <Text style={{ color: theme.secondary, fontWeight: 'bold' }}>{activeUser.current_level}</Text></Text>
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
                <Text style={{ marginVertical: 5, fontStyle: "italic" }}>Nagrada: {currentQuest.xp_reward} XP</Text>

                <TouchableOpacity
                  style={[styles.button, { marginTop: 10 }]}
                  onPress={completeQuest}
                >
                  <Text style={{ color: 'white', textAlign: 'center' }}>OZNAČI KAO ODRAĐENO</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.secondary }]}
          onPress={() => {
            router.push("/panic");
          }}
          >
          <Text style={{ color: theme.bg, textAlign: "center" }}>Panic Taster</Text>
        </TouchableOpacity>
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
  borderRadius: 16,
  boxShadow: "0px 4px 10px rgba(40, 48, 68, 0.1)" 
}

const styles = StyleSheet.create({
  safeAreaProvider: {
    backgroundColor: theme.bg,
    flex: 1,
  },
  mainView: {
    flex: 1,
    padding: 16, 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "900", 
    color: theme.text,
    letterSpacing: -1,
  },
  container: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: theme.borderRadius,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    backgroundColor: theme.primary,
    borderRadius: theme.borderRadius,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center"
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.shadow,
    borderRadius: 10,
  },
  logoutText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600"
  },
  questTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.text,
    textAlign: "center",
    marginBottom: 8
  },
  questDescription: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 12
  },
  rewardBadge: {
    backgroundColor: "rgba(249, 105, 0, 0.1)", 
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 15
  },
  rewardText: {
    color: theme.secondary,
    fontWeight: "bold",
    fontSize: 14
  },
  panicButton: {
    backgroundColor: theme.secondary,
    padding: 18,
    borderRadius: theme.borderRadius,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto", 
  }
});