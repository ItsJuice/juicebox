import React, { Component, PropTypes } from 'react';
import { bindAll } from 'lodash/util';
import styles from './video-placeholder.scss';
import VoteDown from './vote-down.svg';
import VoteUp from './vote-up.svg';

class VideoPlaceholder extends Component {
  constructor(props) {
    super(props);

    bindAll(this, 'onVoteDown', 'onVoteUp');
  }

  onVoteDown() {
    if (this.props.vote === false) { return; }

    this.props.voteDown({
      streamId: this.props.streamId,
      videoId: this.props.video.video_id,
    });
  }

  onVoteUp() {
    if (this.props.vote === true) { return; }

    this.props.voteUp({
      streamId: this.props.streamId,
      videoId: this.props.video.video_id,
    });
  }

  render() {
    return (
      <div className={ styles['video-placeholder'] }>
        <div className={ styles['video-name'] }>
          { this.props.video.title }
        </div>
        <div className={ styles['video-voting'] }>
          <VoteUp onClick={ this.onVoteUp } />
          <VoteDown onClick={ this.onVoteDown } />
        </div>
      </div>
    );
  }
}

VideoPlaceholder.propTypes = {
  streamId: PropTypes.string.isRequired,
  vote: PropTypes.bool,
  voteDown: PropTypes.func,
  voteUp: PropTypes.func,
  video: PropTypes.object,
}

export default VideoPlaceholder;
