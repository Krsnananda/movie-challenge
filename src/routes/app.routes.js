import React from 'react'
import { TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from '../screens/movies'
import FavoriteScreen from '../screens/favorites'
import heart from './../../assets/heart.png'
import { FavoriteMenu } from '../styles'

const AppStack = createStackNavigator()

const AppRoutes = () => (
  <AppStack.Navigator>
    <AppStack.Screen name="Home"
      options={({ navigation }) => ({
        headerTitleAlign: 'center',
        headerTitle: 'Movies',
        headerTintColor: '#fff',
        headerTransparent: true,
      })}
      component={HomeScreen}
    />
    <AppStack.Screen name="Favorites"
      options={{
        headerTitleAlign: 'center',
        headerTintColor: '#fff',
        headerTransparent: true,
      }}
      component={FavoriteScreen}
    />
  </AppStack.Navigator>
)

export default AppRoutes