import React, { Component } from 'react';
import Video from './video';

class VideoList extends Component {
  render() {
    const videos = this.props.videos;

    return (
      <div className="video-list">
        <h2>Videos</h2>
        {videos.map((video, index) => <Video key={index} video={video} />)}
      </div>
    );
  }
}

export default VideoList;
