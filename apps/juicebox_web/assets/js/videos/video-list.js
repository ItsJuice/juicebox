import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Video from './video';

class VideoList extends Component {
  render() {
    const { params: { streamId } } = this.props;
    const videos = this.props.videos;

    return (
      <div className="video-list">
        <h2>Videos</h2>
        {this.props.videos.map((videoObject, index) => <Video key={index} video={videoObject.video} />)}
        <Link to="/stream/juice">Juice</Link>
        <Link to="/stream/kiwi">KIWI</Link>
      </div>
    );
  }
}

VideoList.propTypes = {
  videos: PropTypes.array
}

export default VideoList;
