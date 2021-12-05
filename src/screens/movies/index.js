import React, { useState } from 'react';
import { ActivityIndicator, FlatList, ToastAndroid } from 'react-native'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, omdbapi } from '../../services/api';
import cinema from './../../../assets/cinema.png';
import { Column, Container, EmptyLogo, MovieNotFound, Poster, Search, Wrapper } from './styles';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [columns, setColumns] = useState(3)
  const [movieList, setMovieList] = useState([])
  const [isSearching, setIsSearching] = useState(false)

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
      console.error('Storage error ->', error)
    }
  }

  // Search on database
  const searchDb = async (search) => {
    const url = db.movies + search
    try {
      const result = await axios.get(url)
      return result.data
    } catch (error) {
      console.log('Db error ->', error)
    }
  }

  // Search on API
  const searchApi = async (search) => {
    const url = omdbapi + search
    try {
      const result = await axios.get(url)
      const payload = { movies: result.data.Search }
      try {
        const r = await axios.post(db.saveSearch, payload)
        console.log(r)
      } catch (error) {
        console.log('Saving in db -> ', error)
      }
      return result.data

    } catch (error) {
      console.error('API error -> ', error);
    }
  }

  // Search handler
  const handleSearch = async (search) => {
    search = normalizeTerm(search)
    try {
      if (search.length >= 3) {
        setIsSearching(true)
        const resultStorage = await searchStorage(search)
        if (resultStorage) {
          setMovieList(resultStorage)
          //   console.log(resultStorage)
        } else {
          const resultDb = await searchDb(search)
          if (resultDb) {
            setMovieList(resultDb)
            // console.log(resultDb)
          } else {
            const resultApi = await searchApi(search)
            setMovieList(resultApi.Search)
            // console.log(resultApi)
          }
        }
        setIsSearching(false)
      } else {
        ToastAndroid.showWithGravity(
          "Search term too short!",
          ToastAndroid.LONG,
          ToastAndroid.TOP
        );
        setMovieList([])
      }
    } catch (error) {
      console.log('handleSearch -> ', error)
    }
  }

  const normalizeTerm = (search) => {
    const term = search.split(' ').join('+')
    return term;
  }

  return (
    <Container>
      <Search
        placeholder="Search your favorite movie :)"
        onChangeText={(search) => setSearchQuery(search)}
        onIconPress={() => handleSearch(searchQuery)}
        onSubmitEditing={() => handleSearch(searchQuery)}
        value={searchQuery}
        inputStyle={{ color: "#fff" }}
        placeholderTextColor={"#fff"}
        iconColor={"#fff"}
      />
      {
        isSearching ? (
          <Wrapper>
            <ActivityIndicator size="large" color="#e68027" />
          </Wrapper>

        ) : (
          movieList && movieList.length > 0 ? (
            <FlatList
              data={movieList}
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
          ) : (
            <Wrapper>
              {movieList == undefined ? (
                <MovieNotFound>Movie not found!</MovieNotFound>
              ) : (
                <EmptyLogo source={cinema} />
              )}
            </Wrapper>
          )
        )
      }
    </Container>
  )
}