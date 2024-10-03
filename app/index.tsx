import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, StyleSheet, SafeAreaView} from "react-native";
import CustomTimer from '../components/Timer';
import { useRouter } from 'expo-router';
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider, useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import * as WebBrowser from 'expo-web-browser';


// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL ?? '', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '')

WebBrowser.maybeCompleteAuthSession();

function SignInButton() {
  const supabaseClient = useSupabaseClient();
  const session = useSession();

  async function signInWithGoogle() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar',
        redirectTo: process.env.EXPO_REDIRECT_URL ?? ''
      }
    });

    if (error) {
      console.error('Error signing in:', error.message);
    } else {
      console.log('Signed in successfully');
    }
  }

  return (
    <Button
      title={session ? 'Sign Out' : 'Sign In with Google'}
      onPress={session ? () => supabaseClient.auth.signOut() : signInWithGoogle}
    />
  );
}

export default function App() {
  const router = useRouter();

  const goToTimer = (): void => {
    router.push({
      pathname: './timer'
    });
  }

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Button title="test" onPress={goToTimer} />
      <SignInButton />
    </SessionContextProvider>
  );
}

// export default function App() {
//   const router = useRouter();

//   const goToTimer = (): void => {
//     router.push({
//       pathname: './timer'
//     });
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Button title="test" onPress={goToTimer} />
//       <CustomTimer />
//     </SafeAreaView>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});