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
      isRecording: false,
      video: null,
      stream: null,
    }
  }

  render() {
    const {
      webcamConnected,
      video,
      stream,
      isRecording,
    } = this.state;

    return (
      <div className="reaction-recorder">
        <div className={`webcam
          ${!webcamConnected ? 'offline' : ''}
          ${isRecording ? 'recording' : ''}`}>
          { webcamConnected && <button onClick={this.stopWebcam}>&times;</button> }
          <video src={video || stream} loop autoPlay></video>
          <div className="recorder-controls">
            { !webcamConnected && <button onClick={this.startWebcam}>Record a reaction</button> }
            { (webcamConnected && !video && !isRecording) && <button onClick={this.record}>Record</button> }
            { (webcamConnected && video) && <button onClick={this.clearRecording}>Clear</button> }
            { video && <button onClick={this.send}>Send</button> }
          </div>
        </div>
      </div>
    );
  }

  webcamConnected = (stream) => {
    this.setState({
      stream,
      webcamConnected: true
    });
  }

  startWebcam = () => {
    this.webcam.connect()
      .then(this.webcamConnected);
  }

  stopWebcam = () => {
    this.webcam.disconnect();

    this.setState({
      webcamConnected: false,
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
