import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Button, StyleSheet, SafeAreaView} from "react-native";
import CustomTimer from '../../components/Timer';
import { useRouter } from 'expo-router';
import { createClient } from '@supabase/supabase-js';


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


export default function TimeTime() {
  return (

    <SafeAreaView style={styles.container}>
      <CustomTimer />
    </SafeAreaView>
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