import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/movies'

const AppStack = createStackNavigator()

const AppRoutes = () => (
  <AppStack.Navigator>
    <AppStack.Screen name="Home"
      options={{
        headerTitleAlign: 'center',
        headerTitle: 'Movies'
      }}
      component={HomeScreen}
    />
  </AppStack.Navigator>
)

export default AppRoutes