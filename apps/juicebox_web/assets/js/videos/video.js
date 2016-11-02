import React, { Component } from 'react';

class Video extends Component {
  render() {
    return <img src={ `http://img.youtube.com/vi/${this.props.video.video_id}/0.jpg` } />;
  }
}

export default Video;
