import React, { Component } from 'react';
import { connect } from 'react-redux';
import Video from './video';
import { addVideo } from './actions';

function _onVideoAdded(e) {
  e.preventDefault();
  this.props.addVideo();
}

class VideoList extends Component {
  render() {
    const videos = this.props.videos;

    return (
      <div className="video-list">
        <h2>Videos</h2>
        <a href="#add-video" onClick={_onVideoAdded.bind(this)}>Add video</a>
        {this.props.videos.map((video, index) => <Video key={index} video={video} />)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    videos: state.videos
  };
}

export default connect(mapStateToProps, { addVideo })(VideoList);
