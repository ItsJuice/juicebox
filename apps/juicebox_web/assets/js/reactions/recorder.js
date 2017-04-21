/*global MediaRecorder*/

import React, { Component, PropTypes } from 'react';
import { delay } from 'lodash';
import VideoEncoder from './video-encoder';
import VideoFrame from './video-frame';
import Webcam from './webcam';
import show from '../lib/show-when';
import styles from './styles.scss';
import SnapIcon from './snap.svg';

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

  componentDidMount() {
    this.startWebcam();
  }

  componentWillUnmount() {
    this.stopWebcam();
  }

  recordButton = () =>
    <div className={ styles.btn } onClick={this.record}>
      <SnapIcon className={ styles['snap-icon'] } /> SNAP
    </div>

  clearButton = () =>
    <div className={ styles.btn } onClick={this.clearRecording}>SNAP AGAIN</div>

  sendButton = () =>
    <div className={ styles.btn } onClick={this.send}>PERFECT!</div>

  render() {
    const {
      isConnected,
      video,
      stream,
      isRecording,
    } = this.state;

    return (
      <div className="reaction-recorder">
        <div className={ styles['webcam-container'] }>
          <div className={ `${ styles.webcam }
            ${!isConnected ? styles.offline : ''}
            ${isRecording ? styles.recording : ''} `}>

            <VideoFrame src={video || stream}
              frame={ this.props.frame }
              className={ styles['video-frame'] } />
          </div>
        </div>

        <div className={ styles['recorder-controls'] }>
          { show(this.recordButton).when(isConnected && !video && !isRecording) }
          { show(this.sendButton).when(video) }
          { show(this.clearButton).when(isConnected && video) }
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
  styles: PropTypes.object,
};

export default ReactionRecorder;
