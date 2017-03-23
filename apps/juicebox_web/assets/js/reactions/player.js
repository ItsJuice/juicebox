import './styles.scss';
import React, { Component, PropTypes } from 'react';
import VideoFrame from './video-frame';

class ReactionPlayer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <VideoFrame
        src={ this.props.reaction }
        frame="frame-1"
      />
    );
  }
}

ReactionPlayer.propTypes = {
  reaction: PropTypes.string,
};

export default ReactionPlayer;
