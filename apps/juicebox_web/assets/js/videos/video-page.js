import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
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
    this.props.addVideo({ streamId: this.props.streamId });
  }

  render() {
    const { queue, playing } = this.props;

    return (
      <div className="video-page">
        <Video video={ playing } />
        <VideoList videos={ queue }
                   addVideo={ addVideo } />
        <a href="#add-video" onClick={ this.handleVideoAdded }>Add video</a>

        <Link to="/stream/juice">Juice</Link>
        <Link to="/stream/kiwi">KIWI</Link>
      </div>
    );
  }
}

VideoPage.propTypes = {
  addVideo: PropTypes.func.isRequired,
  queue: PropTypes.array,
  playing: PropTypes.object,
  streamId: PropTypes.string.isRequired,
};

function mapStateToProps( { videos, router } ) {
  let streamId;
  if (router) {
    streamId = router.params.streamId;
  }

  return {
    ...videos,
    streamId,
  };
}

export default connect(mapStateToProps, { addVideo })(VideoPage);
