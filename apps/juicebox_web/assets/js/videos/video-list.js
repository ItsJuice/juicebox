import React, { Component, PropTypes } from 'react';
import VideoPlaceholder from './video-placeholder';

class VideoList extends Component {
  render() {
    const videos = this.props.videos;

    if (!videos) { return null; }

    return (
      <div className="video-list">
        <h2>Videos</h2>
        {videos.map(({video}, index) => <VideoPlaceholder key={index} video={video} />)}
      </div>
    );
  }
}

VideoList.propTypes = {
  videos: PropTypes.array
}

export default VideoList;
