import React, { Component, PropTypes } from 'react';
import styles from './video.scss';

class Video extends Component {

  renderVideo() {
    if (!this.props.video) { return; }

    return <iframe width="280"
                height="157"
                src={`https://www.youtube.com/embed/${this.props.video.video_id}?autoplay=1&start=${this.props.playingStartTime}`}
                frameBorder="0"
                allowFullScreen></iframe>
  }

  render() {
    return (
      <div className={ styles.video }>
        <h2>Now playing</h2>
        <div className={ styles['video-wrapper'] }>
          { this.renderVideo() }
        </div>
      </div>
    );
  }
}

Video.propTypes = {
  video: PropTypes.object,
  playingStartTime: PropTypes.number,
}

export default Video;
