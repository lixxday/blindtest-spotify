/*global swal*/

import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

const apiToken = 'BQAmZubPpVRPWl82vLF02hPNyHijtP6jXM0Vn4FKGfHMyy9e1rwAL_he44YC2rDphz0QzAO3vyu3Qu6nMY0E_jeA0qL3CDYeV83OOlcPnPlAcdZ_ygjDXgTa69mWYYlnZyRohQf24IuMm7WKBeEeXWe4amSU0bmGvBZUjeNz-TtSo0HT01iRfr3O49OLTrj5in3Ig_K54kYHobbzT4y3NMAv_j8Bo83dut1XelzL9idZr9AKnpHKBu42JfOOJebI1z-wrtdESXB7BC8I7JL-MuYB_03o2KVLJgQX3UI';
var timeout;

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      songsLoaded: false,
      tracks: null,
      playingTrackId: 0,
      currentTrack: null,
    };
  }

  replay = () => {
    clearTimeout(timeout);
    timeout = setTimeout(this.replay, 30000);
    this.setState({currentTrack: this.state.tracks[getRandomNumber(this.state.tracks.length)].track});
    this.setState({playingTrackId: this.state.currentTrack.id});
  }

  checkAnswer = (id) => {
    if (id === this.state.playingTrackId) {
      clearTimeout(timeout);
      return swal('Bravo', 'Sous-titre', 'success').then(this.replay);
    }
    return swal('Alerte !!', 'Ceci est une alerte', 'error');
  }
  
  componentDidMount() {
    timeout = setTimeout(this.replay, 30000);
    fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
      Authorization: 'Bearer ' + apiToken,
      },
    })
      .then(response => response.json())
      .then((data) => {
        console.log("Réponse reçue ! Voilà ce que j'ai reçu : ", data);
        this.setState({tracks: data.items});
        this.setState({currentTrack: data.items[getRandomNumber(data.items.length)].track});
        this.setState({playingTrackId: this.state.currentTrack.id});
        this.setState({songsLoaded: true});
      })
  }

  render() {
    if (this.state.songsLoaded) {
      var currentTrack = this.state.currentTrack;
      var track1 = this.state.tracks[getRandomNumber(this.state.tracks.length)].track;
      var track2 = this.state.tracks[getRandomNumber(this.state.tracks.length)].track;
      var previewUrl = currentTrack.preview_url;

      const tracksTable = shuffleArray([currentTrack, track1, track2]);

      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h1 className="App-title">Bienvenue sur le Blindtest</h1>
          </header>
          <div className="App-images">
            <AlbumCover track={this.state.currentTrack} />
            <Sound url={previewUrl} playStatus={Sound.status.PLAYING}/>
          </div>
          <div className="App-buttons">
            {
              tracksTable.map(item => (
                <Button onClick={() => this.checkAnswer(item.id)}>{item.name}</Button>
              ))
            }
          </div>
        </div>
      );
    } else {
      return (
        <div className="App">
          <img src={loading} alt="Chargement en cours"/>
        </div>
      );
    }
  }
}

class AlbumCover extends Component {
  render() {
    const src = this.props.track.album.images[0].url
    return (
      <img src={src} style={{ width: 350, height: 350 }} />
    );
  }
}

export default App;
