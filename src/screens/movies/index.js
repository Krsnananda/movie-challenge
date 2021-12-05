import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { Modal, Portal, Provider, IconButton, Colors } from 'react-native-paper'
import axios from 'axios';
import heart from './../../../assets/heart.png';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, omdbapi } from '../../services/api';
import cinema from './../../../assets/cinema.png';
import {
  Column,
  Container,
  EmptyLogo,
  ModalInfo,
  MovieNotFound,
  Poster,
  Search,
  Info,
  Wrapper
} from './styles';
import { FavoriteMenu } from '../../styles';

export default function HomeScreen() {
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState('')
  const [columns, setColumns] = useState(3)
  const [movieList, setMovieList] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [visible, setVisible] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [checked, setChecked] = useState(false)
  const [movie, setMovie] = useState(
    {
      _id: '',
      Title: '',
      Year: '',
      imdbID: '',
      Type: '',
      Poster: ''
    })

  useEffect(() => {
    axios.get(db.favorites).then((res) => {
      setFavorites(res.data)
    }).catch(error => console.log('Error in favorites ->', error))
  }, [checked])

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Favorites')} >
          <FavoriteMenu resizeMode={'contain'} source={heart} />
        </TouchableOpacity>
      )
    })
  }, [navigation])

  const setFavoriteMovie = async (movie) => {
    try {
      const response = await axios.post(db.favorites, movie)
      setFavorites(response.data)
    } catch (error) {
      console.log('Error on set favorite ->', error.message)
    }
  }

  const removeFavoriteMovie = async (movie) => {
    const url = `${db.favorites}/${movie.imdbID}`
    try {
      await axios.delete(url)
    } catch (error) {
      console.log('Error on remove favorite ->', error.message)
    }
  }

  // Search on Asyncstorage
  const searchStorage = async (search) => {
    try {
      const data = await AsyncStorage.getItem('@Challenge:movies')
      if (data && search.length >= 3) {
        const parsedData = JSON.parse(data)
        const list = parsedData.filter(element => element.Title.includes(search))
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
        await axios.post(db.saveSearch, payload)
        try {
          await AsyncStorage.setItem('@Challenge:movies', JSON.stringify(payload.movies))
        } catch (error) {
          console.log('Saving in storage', error)
        }
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
                      <TouchableOpacity onPress={() => {
                        setMovie(item)
                        setVisible(true)
                      }}>
                        <Poster resizeMode={'contain'} source={{ uri: item.Poster }} />
                      </TouchableOpacity>
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
      <Provider>
        <Portal>
          <ModalInfo
            visible={visible}
            onDismiss={() => setVisible(!visible)}
          >
            {favorites.length > 0 && favorites.find(o => o.imdbID === movie.imdbID) ? (
              <IconButton
                icon={"bookmark"}
                color={Colors.red400}
                size={35}
                style={{ marginVertical: 20, marginHorizontal: 0 }}
                onPress={() => {
                  setChecked(!checked)
                  removeFavoriteMovie(movie)
                }}
              />
            ) : (
              <IconButton
                icon={"bookmark-outline"}
                color={Colors.red400}
                size={35}
                style={{ marginVertical: 20, marginHorizontal: 0 }}
                onPress={() => {
                  setChecked(!checked)
                  setFavoriteMovie(movie)
                }}
              />
            )}
            <Poster resizeMode={'contain'} source={{ uri: movie.Poster }} />
            <Info>{movie.Title}</Info>
            <Info>{'Release date: ' + movie.Year}</Info>
          </ModalInfo>
        </Portal>
      </Provider>
    </Container>
  )
}