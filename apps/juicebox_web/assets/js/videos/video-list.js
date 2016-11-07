import React, { Component } from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux';
import Video from './video';
import { addVideo } from './actions';

function _onVideoAdded(e) {
  e.preventDefault();
  this.props.addVideo({ streamId: this.props.params.streamId });
}

class VideoList extends Component {
  render() {
    const { params: { streamId } } = this.props;
    const videos = this.props.videos;

    return (
      <div className="video-list">
        <h2>Videos</h2>
        <a href="#add-video" onClick={_onVideoAdded.bind(this)}>Add video</a>
        {this.props.videos.map((videoObject, index) => <Video key={index} video={videoObject.video} />)}
        <Link to="/stream/juice">Juice</Link>
        <Link to="/stream/kiwi">KIWI</Link>
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
