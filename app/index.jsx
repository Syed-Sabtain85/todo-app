import { ThemeContext } from '@/context/ThemeContext';
import { Outfit_400Regular, useFonts } from '@expo-google-fonts/outfit';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from "@expo/vector-icons/Octicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { todos } from "../data/todo";

export default function Index() {
  const [todoList, setTodoList] = useState(todos);
  const [text, setText] = useState("");
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
  const [buttonText, setButtonText] = useState("Add Todo");
  const [placeHolder, setPlaceHolder] = useState("Enter the todo");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const isEditing = editingTodoId !== null;
  const [loaded, error] = useFonts({
    Outfit_400Regular,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todoJson = await AsyncStorage.getItem("list");

        if (todoJson !== null) {
          const todo = JSON.parse(todoJson);
          setTodoList(todo.sort((a, b) => b.id - a.id));
        } else {
          setTodoList(todos.sort((a, b) => b.id - a.id));
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const storeTodo = async () => {
      try {
        const todo_json = JSON.stringify(todoList);
        await AsyncStorage.setItem("list", todo_json);
      } catch (e) {
        console.log(e);
      }
    };

    storeTodo();
  }, [todoList]);


  if (!loaded) {
    return null;
  }
  const styles = createStyleSheet(theme, colorScheme)
  const startEditTodo = (todo) => {
    setText(todo.title);
    setEditingTodoId(todo.id);
    setButtonText("Update Todo");
    setPlaceHolder("Update the todo");
  };

  const editTodo = () => {
    if (text.trim() === "") {
      resetUi();
      return;
    }

    setTodoList(
      todoList.map((todo) =>
        todo.id === editingTodoId
          ? { ...todo, title: text }
          : todo
      )
    );
    resetUi();

  };
  const resetUi = () => {
    setText("");
    setEditingTodoId(null);
    setButtonText("Add Todo");
    setPlaceHolder("Enter the todo");
  }

  const addTodo = () => {
    if (text.trim() === "") return;
    setTodoList([
      ...todoList,
      {
        id: todoList.length + 1,
        title: text,
        completed: false,
      }
    ]);
    setText("");
  }

  const toggleTodo = (id) => {
    setTodoList(
      todoList.map((todo) => (
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ))
    )
  }

  const deleteTodo = (id) => {
    setTodoList(todoList.filter((todo) => todo.id !== id));
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeHolder}
          placeholderTextColor={theme.placeHolderText}
          value={text}
          onChangeText={setText}
        />
        <Pressable
          onPress={editingTodoId ? editTodo : addTodo}
          style={styles.addButton}>
          <Text style={styles.addButtonText}>{buttonText}</Text>
        </Pressable>
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

      <Animated.FlatList
        scrollEnabled={!isEditing}
        data={todoList}
        keyExtractor={todoList => todoList.id.toString()}
        showsVerticalScrollIndicator={false}
        itemLayoutAnimation={LinearTransition}
        ListEmptyComponent={
          <Text style={styles.emptyList}>No todo is stored</Text>
        }
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        renderItem={({ item }) => (

          <View style={styles.todoItem}>
            <View style={styles.leftContainer}>
              <Pressable
                style={{ marginRight: 10, opacity: isEditing ? 0.5 : 1 }}
                disabled={isEditing}
                onPress={() => toggleTodo(item.id)}>
                <FontAwesome6 name="circle-check" size={24} style={item.completed ? styles.checkIcon : styles.checkIconUncompleted} />
              </Pressable>

              <Text
                style={[styles.todoText, item.completed && styles.todoTextCompleted]}
                numberOfLines={1}
                ellipsizeMode="middle">
                {item.title}
              </Text>
            </View>
            <View style={styles.iconContainer}>
              <Pressable style={{ opacity: isEditing || item.completed ? 0.5 : 1 }} disabled={isEditing || item.completed} onPress={() => startEditTodo(item)}>
                <MaterialIcons name="mode-edit" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
              </Pressable>

              <Pressable
                style={{ opacity: isEditing ? 0.5 : 1 }}
                disabled={isEditing} onPress={() => deleteTodo(item.id)}>
                <MaterialIcons name="delete-forever" size={24} color="red" />
              </Pressable>
            </View>
          </View>

        )}
      />
    </SafeAreaProvider>
  );
}

function createStyleSheet(theme, colorScheme) {
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
      alignItems: 'center',
      fontFamily: 'Outfit_400Regular',
      flex: 1,
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      height: 45,
      fontSize: 16,
      minWidth: 0,
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.button,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 15,
      marginLeft: 10,
      borderRadius: 5,
    },
    addButtonText: {
      fontFamily: 'Outfit_400Regular',
      color: theme.buttonText,
      fontSize: 13,
      fontWeight: 'bold',
    },
    todoItem: {
      backgroundColor: theme.background,
      padding: 15,
      borderRadius: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: 16,
      height: 60,
    },
    todoTextCompleted: {
      textDecorationLine: 'line-through',
      color: '#999999',
    },
    checkIcon: {
      color: 'green',
    },
    checkIconUncompleted: {
      color: 'gray',
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      minWidth: 0,
    },

    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    emptyList: {
      alignContent: 'center',
      marginHorizontal: 'auto',
      fontFamily: 'Outfit_400Regular',
      fontSize: 18,
      color: theme.text,
      flexShrink: 1,
    },
    todoText: {
      fontFamily: 'Outfit_400Regular',
      fontSize: 18,
      color: theme.text,
      flexShrink: 1,
    },
    editIcon: {

    }
  })
}  