import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { todos } from "../data/todo";

export default function Index() {
  const [todoList, setTodoList] = useState(todos);
  const [text, setText] = useState("");
  const [buttonText, setButtonText] = useState("Add Todo");
  const [placeHolder, setPlaceHolder] = useState("Enter the todo");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const isEditing = editingTodoId !== null;

  const startEditTodo = (todo) => {
    setText(todo.title);
    setEditingTodoId(todo.id);
    setButtonText("Update Todo");
    setPlaceHolder("Update the todo");
  };

  const editTodo = () => {
    if (text.trim() === "") {
      setText("");
      setEditingTodoId(null);
      setButtonText("Add Todo");
      setPlaceHolder("Enter the todo");
      return;
    }

    setTodoList(
      todoList.map((todo) =>
        todo.id === editingTodoId
          ? { ...todo, title: text }
          : todo
      )
    );

    // Reset UI
    setText("");
    setEditingTodoId(null);
    setButtonText("Add Todo");
    setPlaceHolder("Enter the todo");
  };

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
          placeholderTextColor='#6200ee'
          value={text}
          onChangeText={setText}
        />
        <Pressable
          onPress={editingTodoId ? editTodo : addTodo}
          style={styles.addButton}>
          <Text style={styles.addButtonText}>{buttonText}</Text>
        </Pressable>

      </View>

      <FlatList
        scrollEnabled={!isEditing}
        data={todoList}
        keyExtractor={todoList => todoList.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        renderItem={({ item }) => (

          <View style={styles.todoItem}>
            <View style={styles.leftContainer}>
              <Pressable
                style={{ marginRight: 10, opacity: isEditing ? 0.5 : 1 }}
                disabled={isEditing}
                onPress={() => toggleTodo(item.id)}>
                <FontAwesome6
                  name="circle-check"
                  size={24}
                  style={item.completed ? styles.checkIcon : styles.checkIconUncompleted}
                />
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
                <MaterialIcons name="mode-edit" size={24} color="black" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    fontSize: 16,
    minWidth: 0,
    color: 'black',
  },
  addButton: {
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginLeft: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  todoItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#ddd',
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

  todoText: {
    fontSize: 18,
    color: 'black',
    flexShrink: 1,
  },
});      