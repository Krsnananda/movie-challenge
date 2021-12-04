import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, omdbapi } from '../../services/api';
import cinema from './../../../assets/cinema.png';
import { Container, EmptyLogo, Search, Wrapper } from './styles';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [movieList, setMovieList] = useState([])

  // useEffect(() => {
  //   testeFunc()
  // }, [])

  const teste = [
    {
      "_id": "61a9b93839e5b6a465995ab7",
      "title": "Batman 5",
      "year": "2005",
      "imdbID": "tt0372784112323aasasasas",
      "type": "movie",
      "poster": "https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTg3YjEtMDQyM2ZjYzQ5YWFkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
      "__v": 0
    }
  ]
  const value = JSON.stringify(teste);

  // testeeee
  const testeFunc = async () => {
    try {
      console.log(value, '***')
      await AsyncStorage.setItem('@Challenge:movies', value)
    } catch (error) {
      console.log(error)
    }

  }

  // Search on Asyncstorage
  const searchStorage = async (search) => {
    try {
      const data = await AsyncStorage.getItem('@Challenge:movies')
      if (data && search.length >= 3) {
        const parsedData = JSON.parse(data)
        const list = parsedData.filter(element => element.title.includes(search))
        return list
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Search on database
  const searchDb = async (search) => {
    const url = db.movies + search
    try {
      const result = await axios.get(url)
      return result.data
    } catch (error) {
      console.log(error)
    }
  }

  // Search on API
  const searchApi = async (search) => {
    const url = omdbapi + search
    try {
      const result = await axios.get(url)
      return result.data
    } catch (error) {
      console.error(error);
    }
  }

  // Search handler
  const handleSearch = async (search) => {
    setSearchQuery(search)
    try {
      if (search.length >= 3) {
        const resultStorage = await searchStorage(search)
        if (resultStorage.length > 0) {
          // Ver se retorna aqui ou armazena em um state
          resultStorage.map(item => {
            console.log(item, '--> storage')
          })
        } else {
          const resultDb = await searchDb(search)
          if (resultDb) {
            console.log(resultDb)
          } else {
            const resultApi = await searchApi(search)
            console.log(resultApi)
          }
        }
      }
    } catch (error) {
      console.log('handleSearch -> ', error)
    }
  }

  return (
    <Container>
      <Search
        placeholder="Search your favorite movie :)"
        onChangeText={(search) => handleSearch(search)}
        value={searchQuery}
        inputStyle={{ color: "#fff" }}
        placeholderTextColor={"#fff"}
        iconColor={"#fff"}
      />
      <Wrapper>
        <EmptyLogo source={cinema} />
      </Wrapper>
    </Container>
  )
}