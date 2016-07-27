import './app.scss';

import React, { Component } from 'react';
import socket from './sockets/stream';

import VideoList from './components/videos/videos-list';

const VIDEO_SAMPLES = [
  'fd02pGJx0s0',
  'lbjZPFBD6JU',
  'ZBseZ6y7hDQ',
  'uTxythHY09k',
  'tO4dxvguQDk',
  '6hXH5gKIWEA',
  'gzC29VwE1A'
];

function sampleVideo() {
  return VIDEO_SAMPLES[Math.floor(Math.random() * VIDEO_SAMPLES.length)];
}

function onVideoAdded() {
  this.channel.push("video.added", { video_id: sampleVideo() });
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      videos: []
    };
  }

  componentWillMount() {
    this.channel = socket.channel('stream:main', {});
    this.channel.join()
      .receive('ok', resp => { console.log('Joined successfully', resp) })
      .receive('error', resp => { console.log('Unable to join', resp) });

    this.channel.on("video.added", payload => {
      let videos = JSON.parse(JSON.stringify(this.state.videos));
      videos.push(payload);

      this.setState({ videos });
    })
  }

  render() {
    const videos = this.state.videos;

    return (
      <div className="app">
        <a href="#add-video" onClick={onVideoAdded.bind(this)}>Add video</a>
        <VideoList videos={videos} />
      </div>
    );
  }
}

export default App;
