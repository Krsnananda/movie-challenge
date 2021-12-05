import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View, FlatList } from 'react-native'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, omdbapi } from '../../services/api';
import cinema from './../../../assets/cinema.png';
import { Container, EmptyLogo, Poster, Search, Wrapper } from './styles';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [columns, setColumns] = useState(3)
  const [movieList, setMovieList] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    let searchExists = true
    if (searchQuery.length < 3) {
      setMovieList([])
    }
    return (() => {
      searchExists = false
    })
  }, [searchQuery])


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
        setIsSearching(true)
        const resultStorage = await searchStorage(search)
        if (resultStorage.length > 0) {
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
        setMovieList([])
      }
    } catch (error) {
      console.log('handleSearch -> ', error)
    }
  }

  function createRows(data, columns) {
    const rows = Math.floor(data.length / columns);
    let lastRowElements = data.length - rows * columns;
    while (lastRowElements !== columns) {
      data.push({
        imdbID: `empty-${lastRowElements}`,
        title: `empty-${lastRowElements}`,
        type: `empty-${lastRowElements}`,
        year: `empty-${lastRowElements}`,
        poster: `empty-${lastRowElements}`,

        empty: true
      });
      lastRowElements += 1;
    }
    return data;
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
      {
        isSearching ? (
          <Wrapper>
            <ActivityIndicator size="large" color="#e68027" />
          </Wrapper>

        ) : (
          movieList.length > 0 ? (
            <FlatList
              data={createRows(movieList, columns)}
              keyExtractor={item => item.imdbID}
              numColumns={columns}
              renderItem={({ item }) => {
                return (
                  item.Poster != 'N/A' && (
                    <View style={{ flexGrow: 1, margin: 4 }} >
                      <Image style={{ height: 150, resizeMode: 'contain', borderRadius: 10 }} source={{ uri: item.Poster }} />
                    </View>
                  )
                );
              }}
            />
          ) : (
            <Wrapper>
              <EmptyLogo source={cinema} />
            </Wrapper>
          )
        )
      }
    </Container>
  )
}