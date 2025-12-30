import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Todo App",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#6200ee" },
            headerTintColor: "#ffffff",
            headerTitleStyle: { fontSize: 30,fontWeight: "bold" },
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
