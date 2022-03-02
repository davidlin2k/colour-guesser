import React, { useState, useReducer } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, TouchableOpacity } from 'react-native';

const RandomRGB = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  return [ red, green, blue ];
};

const GetColorHint = (guessedAmount, actualAmount) => {
  if (guessedAmount != '') {
    const difference = guessedAmount - actualAmount;
    if (Math.abs(difference) <= 10) {
      if (guessedAmount > actualAmount) {
        return 'Close but too much';
      }
      else if (guessedAmount < actualAmount) {
        return 'Close but less than the actual amount';
      }
      else {
        return 'Correct!';
      }
    }
    else {
      return 'Not Quite';
    }
  }
  else {
    return 'Guess a number first';
  }
};

var [ red, green, blue ] = RandomRGB();

const createAlert = () =>
  Alert.alert(
    "Win!",
    "You guessed the correct combination!",
    [
      {
        text: "Continue",
      },
    ]
);

export default function App() {
  const [ point, setPoint ] = useState(0);

  const [ refresh, setRefresh ] = useState(false);

  const [ showColor, setShowColor ] = useState(false);

  const reducer = (state, action) => {
    switch (action.color) {
        case 'red':
          return {...state, guessed_red: action.amount};
        case 'green':
          return {...state, guessed_green: action.amount};
        case 'blue':
          return {...state, guessed_blue: action.amount};
        default:
            return state
    }
  };

  const [state, dispatch] = useReducer(reducer, { guessed_red:'', guessed_green:'', guessed_blue:'' });
  const { guessed_red, guessed_green, guessed_blue } = state

  const refreshColor = () => {
    [red, green, blue] = RandomRGB();

    dispatch({color: 'red', amount: ''});
    dispatch({color: 'green', amount: ''});
    dispatch({color: 'blue', amount: ''});

    setShowColor(false);

    setRefresh(!refresh);
  };

  const CheckWin = (g_red, a_red, g_green, a_green, g_blue, a_blue) => {
    if (g_red == a_red && g_blue == a_blue && g_green == a_green) {
      setPoint(point + 1);
      refreshColor();
      createAlert();
    }
  };

  var dynamicStyles = StyleSheet.create({
    colorBox: {
      margin: 30,
      height: 100,
      width: 100,
      borderColor: 'black',
      borderWidth: 1,
      backgroundColor: `rgb(${red}, ${green}, ${blue})`,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guess the Colour</Text>
      <Text style={styles.score}>Point: {point}</Text>
      <View style={ dynamicStyles.colorBox }></View>
      <Text>Red ({GetColorHint(guessed_red, red)})</Text>
      <TextInput
        style={styles.input}
        autoCapitalize='none'
        autoCorrect={false}
        onChangeText={ (newText) => {
          dispatch({color: 'red', amount: newText});
          CheckWin(newText, red, guessed_green, green, guessed_blue, blue);
        }}
        value={guessed_red}
      />
      <Text>Green ({GetColorHint(guessed_green, green)})</Text>
      <TextInput
        style={styles.input}
        autoCapitalize='none'
        autoCorrect={false}
        onChangeText={ (newText) => {
          dispatch({color: 'green', amount: newText});
          CheckWin(guessed_red, red, newText, green, guessed_blue, blue);
        }}
        value={guessed_green}
      />
      <Text>Blue ({GetColorHint(guessed_blue, blue)})</Text>
      <TextInput
        style={styles.input}
        autoCapitalize='none'
        autoCorrect={false}
        onChangeText={ (newText) => {
          dispatch({color: 'blue', amount: newText});
          CheckWin(guessed_red, red, guessed_green, green, newText, blue)
        }}
        value={guessed_blue}
      />
      <TouchableOpacity
        onPress={() => {
          setShowColor(true);
          setTimeout(() => { setShowColor(false) }, 1000);
        }}
        style={styles.showColorButton}
      >
        <Text>{showColor ? `${red}, ${green}, ${blue}` : 'Click to See Color for 1 Seconds'}</Text>
      </TouchableOpacity>
      <Button
        title='Update Color'
        onPress={ () => {
          refreshColor();
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    margin:10,
  },
  score:{
    fontSize: 20,
    color: 'red',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffff2'
  },
  showColorButton: {
    margin: 10,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
  },
  input: {
    margin: 15,
    width: 100,
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1
  },
});
