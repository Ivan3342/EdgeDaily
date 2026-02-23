import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, Children } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { User } from './Interfaces/User';


export default function Index() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [quest, setQuest] = useState<any>(null);

  useEffect(() => {
    if (params.user) {
      setActiveUser(JSON.parse(params.user as string));
    }
  }, [params.user])

  const getQuestFromBackend = async () => {
    try {
      const response = await fetch('http://192.168.0.20:3000/get-quest');
      const data = await response.json();
      setQuest(data);
    } catch (error) {
      alert("Proveri da li je server upaljen i IP adresa tačna!");
      console.error(error);
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
          <View style={[styles.mainView, {alignItems: "center", justifyContent: "space-around"}]}>
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
              <Text style={[styles.button, { backgroundColor: theme.secondary, color: theme.bg }]}>Odjavi se</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.mainView}>
          <View style={styles.container}>
            <Text style={{ fontSize: 24 }}>Dobrodošao, {activeUser.username}!</Text>
            <Text>Level: {activeUser.current_level}</Text>
            <Text>XP: {activeUser.xp_points}</Text>
          </View>
          <View style={styles.container}>
            
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
    padding: 14,
    marginVertical: 7,
    borderRadius: theme.borderRadius,
    boxShadow: theme.boxShadow
  }

});