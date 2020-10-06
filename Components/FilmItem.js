// Components/FilmItem.js

import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import { getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'

class FilmItem extends React.Component {

  displayFavorite() {
    if (this.props.isFilmFavorite) {
      // Film dans nos favoris

    return (
      <Image
        style={styles.favorite_image}
        source={require('../image/favorite.png')}
      />
    )
    }
  }

  render() {
    const { film, displayDetailForFilm, isFilmFavorite } = this.props
    return (
      <TouchableOpacity
       style={styles.main_container}
       onPress={() => displayDetailForFilm(film.id)}>
        <Image
          style={styles.image}
          source={{uri: getImageFromApi(film.poster_path)}}
        />
        <View style={styles.content}>
          <View style={styles.header}>
            {this.displayFavorite()}
            <Text style={styles.title_text}>{film.title}</Text>
            <Text style={styles.note}>{film.vote_average}</Text>
          </View>
          <View style={styles.descritionBox}>
            <Text style={styles.description} numberOfLines={6}>{film.overview}</Text>
          </View>
          <View style={styles.dateBox}>
            <Text style={styles.date}>Sorti le {moment(film.release_date, 'YYYY-MM-Do').format('DD/MM/YYYY')}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5
  },
  image: {
    backgroundColor: 'gray',
    marginRight: 10,
    width: 120,
    height: 180,
  },
  content: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    flex: 3
  },
  title_text: {
    fontWeight: 'bold',
    fontSize: 20,
    flex: 3,
    flexWrap: 'wrap',
    paddingRight: 5
  },
  note: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 26,
    color: '#666666'
  },
  descritionBox: {
    flex: 7,
    justifyContent: 'flex-start'
  },
  description: {
    fontStyle: 'italic',
    color: '#666666'
  },
  dateBox: {
    flex: 1,

    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  favorite_image: {
    width: 25,
    height: 25,
    marginRight: 5
  }

})

export default FilmItem
