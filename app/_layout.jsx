import { Outfit_700Bold, useFonts } from '@expo-google-fonts/outfit';
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Outfit_700Bold,
  });

  if (!loaded) {
    return null;
  }
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
            headerTitleStyle: { fontFamily: 'Outfit_700Bold', fontSize: 30 },
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
