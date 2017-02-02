/*global MediaRecorder*/

import React, { Component, PropTypes } from 'react';
import { delay } from 'lodash';
import VideoEncoder from './video-encoder';
import Webcam from './webcam';

const webcam = new Webcam();

class ReactionRecorder extends Component {
  constructor() {
    super();
    this.webcam = new Webcam();
    this.state = {
      webcamConnected: false,
      recording: null,
    }
  }

  render() {
    const { webcamConnected, recording } = this.state;

    return (
      <div>
        <video ref={(video) => this.video = video} loop></video>
        { webcamConnected ? (
            <button onClick={this.stopWebcam}>Disconnect</button>
        ) : (
            <button onClick={this.startWebcam}>Record a reaction</button>
        )}

        { (webcamConnected && !recording) && <button onClick={this.record}>Record</button> }
        { (webcamConnected && recording) && <button onClick={this.clearRecording}>Clear</button> }
        { recording && <button onClick={this.send}>Send</button> }
      </div>
    );
  }

  webcamConnected = (streamURL) => {
    this.video.src = streamURL;
    this.video.play();

    this.setState({
      webcamConnected: true
    });
  }

  startWebcam = () => {
    this.webcam.connect()
      .then(this.webcamConnected);
  }

  stopWebcam = () => {
    this.webcam.disconnect();
    this.video.src = '';

    this.setState({
      webcamConnected: false
    });
  }

  preview = (video) => {
    this.video.src = video;
    this.video.play();

    this.setState({
      recording: video
    });
  }

  send = () => {
    this.props.onRecord(this.state.recording);
    this.stopWebcam();
    this.setState({
      recording: null
    });
  }

  record = () => {
    const recording = this.webcam.record();

    delay(() => {
      recording.stop()
        .then(this.preview)
    }, 2500);
  }

  clearRecording = () => {
    this.setState({
      recording: null
    });
    this.startWebcam();
  }

}

ReactionRecorder.propTypes = {
  onRecord: PropTypes.func,
};

export default ReactionRecorder;
