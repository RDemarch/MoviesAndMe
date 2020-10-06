// Components/FilmDetail.js

import React from 'react'
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, Button, TouchableOpacity, Share } from 'react-native'
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'
import numeral from 'numeral'
import { connect } from 'react-redux'

class FilmDetail extends React.Component {

  constructor(props) {
    super(props)
    this.params = this.props.navigation.state.params
    this.state = {
      film: undefined, // Pour l'instant on n'a pas les infos du film, on initialise donc le film à undefined.
      isLoading: true // A l'ouverture de la vue, on affiche le chargement, le temps de récupérer le détail du film
    }
  }

  _displayLoading() {
    if (this.state.isLoading) {
      // Si isLoading vaut true, on affiche le chargement à l'écran
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size='large' />
        </View>
      )
    }
  }

  _displayFavoriteImage() {
    var sourceImage = require('../image/noFavorite.png')
    if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) !== -1) {
      // Film dans nos favoris
      sourceImage = require('../image/favorite.png')
    }
    return (
      <Image
        style={styles.favorite_image}
        source={sourceImage}
      />
    )
}

  componentDidMount() {
        getFilmDetailFromApi(this.params.idFilm).then(data => {
          this.setState({
            film: data,
            isLoading: false
          })
        })
    }

    _toggleFavorite() {
      const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
      this.props.dispatch(action)
    }

    _displayFilm() {
      if (this.state.film != undefined) {
        return (
          <ScrollView style={styles.scrollview_container}>
            <View style={styles.imageBox}>
              <Image
                style={styles.image}
                source={{uri: getImageFromApi(this.state.film.backdrop_path)}}
              />
            </View>
            <Text style={styles.titre}>{this.state.film.title}</Text>
            <TouchableOpacity
                style={styles.favorite_container}
                onPress={() => this._toggleFavorite()}>
                {this._displayFavoriteImage()}
            </TouchableOpacity>

            <Text style={styles.overview}>{this.state.film.overview}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.info}>Sorti le {moment(this.state.film.release_date, 'YYYY-MM-Do').format('DD/MM/YYYY')}</Text>
              <Text style={styles.info}>Note: {this.state.film.vote_average}/10</Text>
              <Text style={styles.info}>Nombre de votes: {this.state.film.vote_count}</Text>
              <Text style={styles.info}>Budget: {numeral(this.state.film.budget).format('0,0')}</Text>
              <Text style={styles.info}>Genre(s): {this.state.film.genres.map(function(genre){
                return genre.name;
              }).join(" / ")}</Text>
              <Text style={styles.info}>Compagnie(s): {this.state.film.production_companies.map(function(company){
                return company.name;
              }).join(" / ")}</Text>
            </View>

          </ScrollView>
        )
      }
    }
    _shareFilm() {
      const { film } = this.state
      Share.share({ title: film.title, message: film.overview })
    }

    _displayFloatingActionButton() {
        const { film } = this.state
        if (film != undefined && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
          return (
            <TouchableOpacity
              style={styles.share_touchable_floatingactionbutton}
              onPress={() => this._shareFilm()}>
              <Image
                style={styles.share_image}
                source={require('../image/ic_share.png')} />
            </TouchableOpacity>
          )
        }
    }

    render() {
      return (
        <View style={styles.main_container}>
          {this._displayLoading()}
          {this._displayFilm()}
          {this._displayFloatingActionButton()}
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    main_container: {
      flex: 1
    },
    loading_container: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    },
    scrollview_container: {
      flex: 1
    },
    image: {
      height: 169,
      margin: 5,

    },
    titre: {
      width: '100%',
      flex: 1,
      textAlign: 'center',
      fontSize: 35,
      fontWeight: 'bold',
      marginTop: 20
    },
    overview: {
      width: '100%',
      flex: 5,
      fontSize: 15,
      fontStyle: 'italic',
      color: 'grey',
      marginTop: 20
    },
    infoBox: {
      flex: 4,
      marginTop: 50
    },
    favorite_container: {
      alignItems: 'center', // Alignement des components enfants sur l'axe secondaire, X ici
    },
    favorite_image: {
        width: 40,
        height: 40
    },
    share_touchable_floatingactionbutton: {
      position: 'absolute',
      width: 60,
      height: 60,
      right: 30,
      bottom: 30,
      borderRadius: 30,
      backgroundColor: '#e91e63',
      justifyContent: 'center',
      alignItems: 'center'
    },
    share_image: {
      width: 30,
      height: 30
    }
  })

  const mapStateToProps = (state) => {
    return {
      favoritesFilm: state.favoritesFilm
    }
  }

export default connect(mapStateToProps)(FilmDetail)
