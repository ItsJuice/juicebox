import React, { Component, PropTypes } from 'react';

class Video extends Component {
  render() {
    if (!this.props.video) { return null; }

    return (
      <div className="video" style={{display: 'inline-block'}}>
        <iframe width="280"
                height="157"
                src={`https://www.youtube.com/embed/${this.props.video.video_id}?autoplay=1&start=${this.props.playingStartTime}`}
                frameBorder="0"
                allowFullScreen>

        </iframe>
      </div>
    );
  }
}

Video.propTypes = {
  video: PropTypes.object,
  playingStartTime: PropTypes.integer,
}

export default Video;
