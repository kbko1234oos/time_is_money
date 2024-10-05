import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="timer/index" options={{ title: 'Timer' }} />
      {/* Add other main screens here if needed */}
    </Stack>
  );
}