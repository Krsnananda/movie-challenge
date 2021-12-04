import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import axios from 'axios';
import { Searchbar } from 'react-native-paper';
import { db, omdbapi } from '../../services/api';
import cinema from './../../../assets/cinema.png';
import { Container, EmptyLogo, Search, Wrapper } from './styles';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('')

  // useEffect(() => {
  //   axios.get(db)
  // }, [])

  const getMovies = (search) => {
    const url = db.movies + search
    setSearchQuery(search)

    // axios.get(url)
  }

  return (
    <Container>
      <Search
        placeholder="Search your favorite movie :)"
        onChangeText={(search) => getMovies(search)}
        value={searchQuery}
        placeholderTextColor={"#fff"}
        iconColor={"#fff"}
      />
      <Wrapper>
        <EmptyLogo source={cinema} />
      </Wrapper>
    </Container>
  )
}