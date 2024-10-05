// import React, { useState, useEffect } from 'react';
// import { Text, View, TextInput, Button, StyleSheet, SafeAreaView} from "react-native";
// import CustomTimer from '../components/Timer';
// import { useRouter } from 'expo-router';
// import { createClient } from '@supabase/supabase-js';
// import { SessionContextProvider, useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
// import * as WebBrowser from 'expo-web-browser';
// import { makeRedirectUri } from 'expo-auth-session';
// import { URLSearchParams } from 'url';

// // export default function Index() {
// //   return (
// //     <View
// //       style={{
// //         flex: 1,
// //         justifyContent: "center",
// //         alignItems: "center",
// //       }}
// //     >
// //       <Text>Edit app/index.tsx to edit this screen.</Text>
// //     </View>
// //   );
// // }

// const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL ?? '', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '')

// WebBrowser.maybeCompleteAuthSession();

// const redirectUri = makeRedirectUri({
//   scheme: 'myapp'
// });


// export default function App() {
//   const router = useRouter();
//   const supabaseClient = useSupabaseClient();
//   const session = useSession();

//   const goToTimer = (): void => {
//     router.push({
//       pathname: './timer'
//     });
//   }

//   return (
//     <SessionContextProvider supabaseClient={supabase}>
//       <Button title="test" onPress={goToTimer} />
//       <Button
//       title={session ? 'Sign Out' : 'Sign In with Google'}
//       onPress={session ? () => supabaseClient.auth.signOut() : signInWithGoogle}
//       />
//     </SessionContextProvider>
//   );
// }


// async function signInWithGoogle() {
//   try {
//     const { data, error } = await supabaseClient.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         scopes: 'https://www.googleapis.com/auth/calendar',
//         redirectTo: redirectUri,
//       }
//     });

//     if (error) throw error;

//     const result = await WebBrowser.openAuthSessionAsync(
//       data?.url ?? '',
//       redirectUri
//     );

//     if (result.type === 'success') {
//       const url = new URL(result.url);
//       const access_token = url.searchParams.get('access_token');
//       const refresh_token = url.searchParams.get('refresh_token');

//       if (access_token && refresh_token) {
//         await supabaseClient.auth.setSession({
//           access_token,
//           refresh_token,
//         });
//         console.log('Signed in successfully');
//       } else {
//         throw new Error('Access token or refresh token missing from URL');
//       }
//     } else {
//       throw new Error('Browser authentication failed');
//     }
//   } catch (error) {
//     console.error('Error signing in:', String(error));
//   }

//   // return (
//   //   <Button
//   //     title={session ? 'Sign Out' : 'Sign In with Google'}
//   //     onPress={session ? () => supabaseClient.auth.signOut() : signInWithGoogle}
//   //   />
//   // );
// }

// // export default function App() {
// //   const router = useRouter();

// //   const goToTimer = (): void => {
// //     router.push({
// //       pathname: './timer'
// //     });
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <Button title="test" onPress={goToTimer} />
// //       <CustomTimer />
// //     </SafeAreaView>
// //   );
// // }

import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, TextInput, Button, StyleSheet, SafeAreaView} from "react-native";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { SessionContextProvider, useSession, useSupabaseClient} from '@supabase/auth-helpers-react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
//import * as Crypto from 'expo-crypto';

WebBrowser.maybeCompleteAuthSession();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? '', 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ''
)

const LoginScreen: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleDeepLink = useCallback(async (event: Linking.EventType) => {
    const url: string = event.url;
    if (url.includes('/auth/callback')) {
      await WebBrowser.dismissBrowser();
      
      const params = Linking.parse(url).queryParams as { access_token?: string };
      if (params.access_token) {
        setAccessToken(params.access_token);
        console.log('Access Token:', params.access_token);
      }
    }
  }, []);

  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [handleDeepLink]);

  const googleSignIn = async (): Promise<void> => {
    // Create a redirect URI using expo-auth-session
    const redirectUrl = makeRedirectUri({
      scheme: 'timemoney'
    });
  
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar',
        redirectTo: redirectUrl,
      },
    });
  
    if (error) {
      console.error('Error during sign-in:', error);
      return;
    }
  
    if (data && data.url) {
      try {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (result.type === 'success') {
          const { url } = result;
          // Handle the returned URL
          await handleRedirect(url);
        }
      } catch (err) {
        console.error('Error in WebBrowser:', err);
      }
    }
  };
  
  const handleRedirect = async (url: string) => {
    const { queryParams } = Linking.parse(url);
    const access_token = (queryParams?.access_token as string) || '';
    const refresh_token = (queryParams?.refresh_token as string) || undefined;
  
    if (access_token) {
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token: refresh_token ?? undefined,
      });
      if (error) {
        console.error('Error setting session:', error);
      } else {
        console.log('User signed in:', data.user);
      }
    } else {
      console.error('No access token found in the URL');
    }
  };

  return (
    <Button title="Sign in with Google" onPress={googleSignIn} />
  );
};


export default function App() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const session = useSession();

  const goToTimer = (): void => {
    router.push({
      pathname: './timer'
    });
  }

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <SafeAreaView style={styles.container}>
        <Button title="Go to Timer" onPress={goToTimer} />
        <LoginScreen />
      </SafeAreaView>
    </SessionContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});






















// const LoginScreen = () => {
//   const [accessToken, setAccessToken] = useState(null);

//   useEffect(() => {
//     const handleDeepLink = async (event) => {
//       const url = event.url;
//       if (url.includes('/auth/callback')) {
//         WebBrowser.dismissBrowser();
        
//         // Extract the access token from the URL
//         const params = Linking.parse(url).queryParams as { access_token?: string };
//         if (params.access_token) {
//           setAccessToken(params.access_token);
//           console.log('Access Token:', params.access_token);
//         }
//       }
//     };

//     Linking.addEventListener('url', handleDeepLink);

//     return () => {
//       Linking.removeAllListeners('url');
//     };
//   }, []);

//   const googleSignIn = async () => {
//     const redirectUrl = makeRedirectUri({
//       path: '/auth/callback',
//       scheme: 'myapp', // Replace with your app's custom scheme
//     });

//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: {
//         scopes: 'https://www.googleapis.com/auth/calendar',
//         redirectTo: redirectUrl,
//       },
//     });

//     if (error) {
//       console.error('Error during sign-in:', error);
//       return;
//     }

//     // Open the URL in a web browser
//     await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
//   };

//   return (
//     <Button title="Sign in with Google" onPress={googleSignIn} />
//   );
// };