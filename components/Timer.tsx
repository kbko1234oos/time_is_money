import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const size = width * 0.6; // Reduced size for the circle
const strokeWidth = 10;
const radius = (size - strokeWidth) / 2;
const circumference = radius * 2 * Math.PI;

const CustomTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');
  const [inputSeconds, setInputSeconds] = useState('');
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    const totalSeconds = parseInt(inputMinutes) * 60 + parseInt(inputSeconds);
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setTotalTime(totalSeconds);
      setIsRunning(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Avoid division by zero
  const progress = totalTime > 0 ? (timeLeft / totalTime) * circumference : circumference;

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Minutes"
          keyboardType="numeric"
          value={inputMinutes}
          onChangeText={setInputMinutes}
        />
        <Text style={styles.separator}>:</Text>
        <TextInput
          style={styles.input}
          placeholder="Seconds"
          keyboardType="numeric"
          value={inputSeconds}
          onChangeText={setInputSeconds}
        />
      </View>

      <View style={styles.timerContainer}>
        <Svg width={size} height={size}>
          <Circle
            stroke="#e6e6e6"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke="#007AFF"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progress.toString()} // Cast to string
            strokeLinecap="round"
          />
        </Svg>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={startTimer}>
        <Text style={styles.buttonText}>Start Timer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align items at the top
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center', // Center align inputs vertically
    justifyContent: 'center', // Center align inputs horizontally
   },
   input: {
     width: '30%', // Adjusted width for better visibility
     borderColor: '#ccc',
     borderWidth: 1,
     padding: 10,
     marginHorizontal: 5,
     textAlign: 'center',
     borderRadius: 10,
     fontSize: 18, // Increased font size for better readability
   },
   separator: {
     fontSize: 24,
     alignSelf: 'center',
     marginHorizontal: 5,
   },
   timerContainer: {
     alignItems: 'center',
     marginTop: -10, // Adjusted margin to bring timer closer to circle
     marginBottom: 20, // Added margin bottom for spacing from button
   },
   timerText: {
     fontSize: size / 8, // Dynamically sized font based on circle size
     fontWeight: 'bold',
     color: '#000', // Changed color to black for better visibility
     position: 'absolute', // Positioned absolutely to center it over the circle
     top: width / 4.5,
     left: width / 4.6,
     textAlign: 'center'
   },
   button: {
     backgroundColor: '#007AFF',
     paddingVertical: 15,
     paddingHorizontal: 30,
     borderRadius: 5,
   },
   buttonText: {
     color: '#fff',
     fontSize: 18,
     fontWeight: 'bold',
   },
});

export default CustomTimer;