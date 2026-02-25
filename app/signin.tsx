import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, useColorScheme, Touchable, TextInput, Image, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { User } from './Interfaces/User';

export default function SignIn() {
    const [users, setUsers] = useState<User[]>();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();

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
            const response = await fetch("http://192.168.0.20:3000/users");
            const data: User[] = await response.json();
            setUsers(data);

            const foundUser = data.find((user) => user.username === username && user.password === password);

            if (foundUser) {
                router.replace({
                    pathname: '/',
                    params: { user: JSON.stringify(foundUser) }
                });
            }
            else {
                Alert.alert("Greška ⚠️", "Pogrešno ime ili lozinka!");
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
                    title: "Prijava",
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
                            placeholder='Korisničko ime'
                            textContentType="username"
                            onChangeText={handleUsernameChange}
                        />
                    </View>
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder='Lozinka'
                            textContentType='password'
                            onChangeText={handlePasswordChange}
                            secureTextEntry={true}
                        />
                    </View>
                    <View>
                        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                            <Text style={styles.buttonText}>Prijavi se</Text>
                        </TouchableOpacity></View>
                    <Text style={{ textAlign: "center", marginVertical: 20 }}>Ili...</Text>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
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
    borderRadius: 16,
    boxShadow: "0px 4px 10px rgba(40, 48, 68, 0.1)"
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
        marginVertical: 10
    },

    buttonText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
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
        boxShadow: theme.boxShadow
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