import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../../services/api';
import { ActivityIndicator, FlatList, Text } from 'react-native';
import { Column, Container, Poster, Wrapper } from '../movies/styles';

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState([])
  const [columns, setColumns] = useState(3)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getFavorites()
  }, [])

  const getFavorites = async () => {
    try {
      setIsLoading(true)
      const result = await axios.get(db.favorites)
      setFavorites(result.data)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      {isLoading ? (
        <Wrapper>
          <ActivityIndicator size="large" color="#e68027" />
        </Wrapper>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.imdbID}
          numColumns={columns}
          renderItem={({ item }) => {
            return (
              item.Poster != 'N/A' && (
                <Column>
                  <Poster resizeMode={'contain'} source={{ uri: item.Poster }} />
                </Column>
              )
            );
          }}
        />
      )}
    </Container>

  )
}