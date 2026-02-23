import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, useColorScheme, Touchable, TextInput, Image, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { User } from './Interfaces/User';

export default function SignIn() {
    const [quest, setQuest] = useState<any>(null);
    const [users, setUsers] = useState<User[]>();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const googleUri = "https://cdn.iconscout.com/icon/free/png-256/free-google-icon-svg-download-png-1507807.png";
    const instagramUri = "https://cdn.iconscout.com/icon/free/png-512/free-instagram-logo-icon-svg-download-png-1583142.png?f=webp&w=256";
    const facebookUri = "https://cdn.iconscout.com/icon/free/png-512/free-facebook-logo-icon-svg-download-png-1350125.png?f=webp&w=256";

    const handleUsernameChange = (user: string) => {
        setUsername(user);
    }

    const handlePasswordChange = (pass: string) => {
        setPassword(pass);
    }

    const handleSignIn = async () => {
        try {
            //Fecovanje podataka - SAMO ZA SVRHE DEMONSTRACIJE
            const response = await fetch("http://192.168.0.20:3000/users");
            const data: User[] = await response.json();
            setUsers(data);

            //Logovanje

            if(users?.find((user) => user.username === username && user.password === password)) {
                Alert.alert("Uspesno Logovanje", "Uzivajte u aplikaicji! 😁");
            }
            else {
                Alert.alert("Greska!", "Podaci koji su uneti se ne poklapaju sa onim u nasoj bazi. 😵‍💫");
            }

        } catch (error) {
            console.error("Fetch error:", error);
        }

    }

    return (
        <SafeAreaProvider style={styles.safeAreaProvider}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: "Sign In",
                    headerTitleAlign: "center"
                }}
            />
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor="transparent"
                translucent={true}
            />
            <SafeAreaView style={styles.mainView}>
                <View style={styles.mainView}>
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder='Username'
                            textContentType="username"
                            id='username'
                            onChangeText={handleUsernameChange}
                        />
                    </View>
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder='Password'
                            textContentType='password'
                            id='password'
                            onChangeText={handlePasswordChange}
                            secureTextEntry={true}
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={handleSignIn}
                        ><Text style={[styles.button, styles.input, { textAlign: "center" }]}>Sign In</Text></TouchableOpacity>
                    </View>
                    <Text style={{ textAlign: "center", marginVertical: 20 }}>Or...</Text>
                    <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
                        <TouchableOpacity>
                            <View style={[styles.iconWrapper, styles.input]}>
                                <Image
                                    style={styles.icon}
                                    source={{ uri: googleUri }}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={[styles.iconWrapper, styles.input]}>
                                <Image
                                    style={styles.icon}
                                    source={{ uri: facebookUri }}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={[styles.iconWrapper, styles.input]}>
                                <Image
                                    style={styles.icon}
                                    source={{ uri: instagramUri }}
                                />
                            </View>
                        </TouchableOpacity>
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
    boxShadow: "0px 2px 7px #E1DDDE"
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
        boxShadow: `0px 2px 7px ${theme.shadow}`,
        color: theme.bg
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        padding: 4
        // Dodati custom font ovde
    },
    input: {
        padding: 14,
        marginVertical: 9,
        borderWidth: 1,
        borderColor: theme.shadow,
        borderRadius: theme.borderRadius,
        boxShadow: theme.boxShadow,
    },
    iconWrapper: {
        alignItems: "center",
        justifyContent: "center",
        width: 80,
        height: 60,
    },
    icon: {
        width: 45,
        height: 45,
    }
});