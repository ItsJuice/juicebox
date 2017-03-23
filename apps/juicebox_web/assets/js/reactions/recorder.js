/*global MediaRecorder*/

import React, { Component, PropTypes } from 'react';
import { delay } from 'lodash';
import VideoEncoder from './video-encoder';
import VideoFrame from './video-frame';
import Webcam from './webcam';
import show from '../lib/show-when';

const webcam = new Webcam();

class ReactionRecorder extends Component {
  constructor() {
    super();
    this.webcam = new Webcam();
    this.state = {
      isConnected: false,
      isRecording: false,
      video: null,
      stream: null,
    }
  }

  startButton = () =>
    <button onClick={this.startWebcam}>Record a reaction</button>

  stopButton = () =>
    <button onClick={this.stopWebcam}>&times;</button>

  recordButton = () =>
    <button onClick={this.record}>Record</button>

  clearButton = () =>
    <button onClick={this.clearRecording}>Clear</button>

  sendButton = () =>
    <button onClick={this.send}>Send</button>

  render() {
    const {
      isConnected,
      video,
      stream,
      isRecording,
    } = this.state;

    return (
      <div className="reaction-recorder">
        <div className={`webcam
          ${!isConnected ? 'offline' : ''}
          ${isRecording ? 'recording' : ''}`}>

          { show(this.stopButton).when(isConnected) }
          <VideoFrame src={video || stream} frame="frame-2" />

          <div className="recorder-controls">
            { show(this.startButton).when(!isConnected) }
            { show(this.recordButton).when(isConnected && !video && !isRecording) }
            { show(this.clearButton).when(isConnected && video) }
            { show(this.sendButton).when(video) }
          </div>
        </div>
      </div>
    );
  }

  onConnect = (stream) => {
    this.setState({
      stream,
      isConnected: true
    });
  }

  startWebcam = () => {
    this.webcam.connect()
      .then(this.onConnect);
  }

  stopWebcam = () => {
    this.webcam.disconnect();

    this.setState({
      isConnected: false,
      video: null,
    });
  }

  preview = (video) => {
    this.setState({ video });
  }

  send = () => {
    this.props.onRecord(this.state.video);
    this.stopWebcam();
    this.setState({
      video: null
    });
  }

  record = () => {
    const recording = this.webcam.record();
    this.setState({ isRecording: true });

    delay(() => {
      recording.stop()
        .then(this.stopRecording)
    }, 2500);
  }

  stopRecording = (video) => {
    this.setState({ isRecording: false });
    this.preview(video);
  }

  clearRecording = () => {
    this.setState({
      video: null
    });
  }
}

ReactionRecorder.propTypes = {
  onRecord: PropTypes.func,
};

export default ReactionRecorder;
