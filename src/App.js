/*global swal*/

import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

const apiToken = 'BQBmGruYdwvHLelaIykqKxd_hIuLjCyK4kyL57ij4Ur-V6JIbS2xLrFzj0Y5o61KP8VQfXUaUf2ZoZEjtjPjlHdq8mgHv6Dx9eDCUxVAhgkyVTpo69AXCvLHrYMIQkh4dch_AE6Gxye8zK-_uroln2Zw_7oanGzWaGh7B7exkxU7wOKVRlIyhW2_hZ9ZGk71Mke-4wao-MEq8Oq6UvCHl56DyciP0uzPj5fr3vQrflORa1ZqPrB7L6jloH2aV_bBEXf-AU-he-NBNByMqcncvSho03iFL4idpEdbavY';

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

/*
function checkAnswer(id, solution) {
  if (id === solution) {
    return swal('Bravo', 'Sous-titre', 'success');
  }
  return swal('Alerte !!', 'Ceci est une alerte', 'error');
}

function replay() {
  this.setState({currentTrack: this.state.tracks[getRandomNumber(this.state.tracks.length)].track});
}
//*/

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
    this.setState({currentTrack: this.state.tracks[getRandomNumber(this.state.tracks.length)].track});
    this.setState({playingTrackId: this.state.currentTrack.id})
  }

  checkAnswer = (id) => {
    if (id === this.state.playingTrackId) {
      return swal('Bravo', 'Sous-titre', 'success').then(this.replay);
    }
    return swal('Alerte !!', 'Ceci est une alerte', 'error');
  }
  
  componentDidMount() {
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
      <img src={src} style={{ width: 60, height: 60 }} />
    );
  }
}

export default App;
