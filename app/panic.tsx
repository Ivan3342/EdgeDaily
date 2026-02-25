import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';

const theme = {
    bg: "#FBF5F3",
    primary: "#4C956C", // Zelena
    secondary: "#F96900", // Narandžasta
    text: "#283044", // Tamno plava
    shadow: "#E1DDDE",
    borderRadius: 12,
    boxShadow: "0px 2px 7px #E1DDDE"
}

export default function PanicZone() {
    const router = useRouter();
    const [instruction, setInstruction] = useState('Udahnite...');
    const growAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const breatheCycle = () => {
            // Udah (4s)
            setInstruction('Udahnite polako...');
            Animated.timing(growAnim, {
                toValue: 1.6,
                duration: 4000,
                useNativeDriver: true,
            }).start(() => {
                // Zadrži (4s)
                setInstruction('Zadržite dah...');
                setTimeout(() => {
                    // Izdah (4s)
                    setInstruction('Izdahnite polako...');
                    Animated.timing(growAnim, {
                        toValue: 1,
                        duration: 4000,
                        useNativeDriver: true,
                    }).start(() => {
                        // Pauza (2s)
                        setInstruction('Spremite se...');
                        setTimeout(breatheCycle, 2000);
                    });
                }, 4000);
            });
        };
        breatheCycle();
    }, []);

    return (
        <SafeAreaProvider style={styles.safeAreaProvider}>
          <Stack.Screen 
            options={{
              headerShown: true,
              title: "Panic Zone",
              headerTitleAlign: "center"            
            }}
          />
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.mainView}>
                
                {/* Sekcija za disanje */}
                <View style={styles.breathingSection}>
                    <Animated.View style={[styles.circle, { transform: [{ scale: growAnim }] }]}>
                        <View style={styles.innerCircle} />
                    </Animated.View>
                    <Text style={styles.instructionText}>{instruction}</Text>
                </View>

                {/* Kartica sa savetima (Grounding) */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Tehnika 5-4-3-2-1</Text>
                    <Text style={styles.cardText}>👀 Vidi 5 stvari oko sebe</Text>
                    <Text style={styles.cardText}>🖐️ Dodirni 4 stvari</Text>
                    <Text style={styles.cardText}>👂 Čuj 3 različita zvuka</Text>
                    <Text style={styles.cardText}>👃 Pomiriši 2 stvari</Text>
                    <Text style={styles.cardText}>👅 Okusi 1 stvar</Text>
                </View>

                {/* Exit Dugme */}
                <TouchableOpacity 
                    style={[styles.button, { marginTop: 'auto', marginBottom: 20 }]} 
                    onPress={() => router.back()}
                >
                    <Text style={styles.buttonText}>Izlaz</Text>
                </TouchableOpacity>

            </SafeAreaView>
        </SafeAreaProvider>
    );
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
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        padding: 4
    },
    breathingSection: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20
    },
    circle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: "rgba(76, 149, 108, 0.2)", // Prozirna primarna zelena
        justifyContent: "center",
        alignItems: "center",
    },
    innerCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.primary,
    },
    instructionText: {
        fontSize: 22,
        color: theme.text,
        fontWeight: "600",
        marginTop: 50,
        textAlign: "center"
    },
    card: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: theme.borderRadius,
        boxShadow: theme.boxShadow, // Koristi tvoj shadow
        borderWidth: 1,
        borderColor: theme.shadow,
        marginBottom: 20
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: theme.text,
        marginBottom: 10
    },
    cardText: {
        fontSize: 16,
        color: theme.text,
        marginVertical: 4
    },
    button: {
        padding: 16,
        backgroundColor: theme.primary,
        borderRadius: theme.borderRadius,
        boxShadow: theme.boxShadow,
        alignItems: "center"
    },
    buttonText: {
        color: theme.bg,
        fontWeight: "bold",
        fontSize: 18
    }
});