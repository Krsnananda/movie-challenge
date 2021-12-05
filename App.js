import React from 'react';
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
