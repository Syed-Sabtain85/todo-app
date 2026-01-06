import { ThemeContext } from '@/context/ThemeContext';
import { Outfit_400Regular, useFonts } from '@expo-google-fonts/outfit';
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditScreen() {
    const { id } = useLocalSearchParams()
    const [todo, setTodo] = useState({});
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
    const router = useRouter()

    const [loaded, error] = useFonts({
        Outfit_400Regular,
    });

    useEffect(() => {
        const fetchData = async (id) => {
            try {
                const todoJson = await AsyncStorage.getItem("list");

                if (todoJson !== null) {
                    const sTodo = JSON.parse(todoJson);
                    const myTodo = sTodo.find(todos => todos.id.toString() === id)
                    setTodo(myTodo);
                } else {
                    console.error("error occurred");
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchData(id);
    }, [id]);

    const styles = createStylesheet(theme)
    const handleSave = async () => {
        try {
            const savedTodo = {  ...todo,title: todo.title }
            const jsonValue = await AsyncStorage.getItem('list')
            const storage = JSON.parse(jsonValue)
            if (jsonValue != null && storage.length) {
                const otherTodos = storage.filter(
                    todos => todos.id.toString() !== savedTodo.id.toString()
                )
                const allTodos = [...otherTodos, savedTodo]
                await AsyncStorage.setItem('list', JSON.stringify(allTodos))
            }
            router.back()
        } catch (e) {
            console.error(e)
        }
    }


    if (!loaded) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    value={todo.title || ''}
                    style={styles.input}
                    placeholder='Update the todo'
                    onChangeText={(text) => setTodo({ ...todo, title: text })}
                />

                <Pressable
                    onPress={() => {
                        setColorScheme(colorScheme === 'light' ? 'dark' : 'light')
                    }}
                    style={{ marginLeft: 10 }}>
                    {
                        colorScheme === 'dark'
                            ? <Octicons name='moon' size={36} color={theme.text} style={{ width: 36 }} />
                            : <Octicons name='sun' size={36} color={theme.text} style={{ width: 36 }} />
                    }
                </Pressable>
            </View>
            <View>
                <Pressable onPress={handleSave} style={styles.updateBtn}>
                    <Text style={styles.btnText}>Save</Text>
                </Pressable>
                <Pressable
                    onPress={()=>{router.back()}}
                    style={{ ...styles.updateBtn, backgroundColor: 'red' }}>
                    <Text style={styles.btnText}>Cancel</Text>
                </Pressable>
            </View>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaView>
    )
}

function createStylesheet(theme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 10,
            backgroundColor: theme.background,
        },
        inputContainer: {
            flexDirection: 'row',
            marginBottom: 10,
        },
        input: {
            fontFamily: 'Outfit_400Regular',
            flex: 1,
            borderColor: theme.borderColor,
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            height: '100%',
            fontSize: 16,
            minWidth: 0,
            color: theme.text,
        },
        updateBtn: {
            height: 45,
            backgroundColor: theme.button,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 15,
            borderRadius: 8,
            marginTop: 10
        }
        ,
        btnText: {
            fontFamily: 'Outfit_400Regular',
            color: theme.buttonText,
            fontSize: 13,
            fontWeight: 'bold',
        }
    })
}




