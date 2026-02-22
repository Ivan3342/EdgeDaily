import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, useColorScheme, Touchable } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const [quest, setQuest] = useState<any>(null);

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

  const handleSignIn = () => {
    console.log("Signed in!")
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
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSignIn}
          ><Text style={{color: theme.bg}}>Sign In</Text></TouchableOpacity>
        </View>
        <View style={styles.mainView}>
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
  borderRadius: 12
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
    boxShadow: `0px 2px 7px ${theme.shadow}`
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    padding: 4
    // Dodati custom font ovde
  },

});