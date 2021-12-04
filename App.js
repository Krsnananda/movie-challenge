import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import Routes from './src/routes'

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#0f111c',
    },
  }

  return (
    <NavigationContainer theme={theme}>
      <Routes />
    </NavigationContainer>
  )
}
