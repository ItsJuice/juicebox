import React, { Component, PropTypes } from 'react';

class VideoPlaceholder extends Component {
  render() {
    return <img src={ `http://img.youtube.com/vi/${this.props.video.video_id}/0.jpg` } />;
  }
}

VideoPlaceholder.propTypes = {
  video: PropTypes.object,
}

export default VideoPlaceholder;
