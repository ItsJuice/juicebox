import React, { Component } from 'react';
import { connect } from 'react-redux';
import Video from './video';
import { addVideo } from './actions';
import VideoList from './video-list';

class VideoPage extends Component {

  constructor(props) {
    super(props);
    this.handleVideoAdded = this.handleVideoAdded.bind(this);
  }

  handleVideoAdded(e) {
    e.preventDefault();
    this.props.addVideo();
  }

  render() {
    const { videos } = this.props;

    return (
      <div className="video-page">
        <VideoList videos={ videos }
                   addVideo={ addVideo } />
        <a href="#add-video" onClick={this.handleVideoAdded}>Add video</a>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    videos: state.videos
  };
}

export default connect(mapStateToProps, { addVideo })(VideoPage);
