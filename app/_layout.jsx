import { Outfit_700Bold, useFonts } from '@expo-google-fonts/outfit';
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Outfit_700Bold,
  });

  if (!loaded) {
    return null;
  }
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="index" />
          <Stack.Screen name="todos/[id]" />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
