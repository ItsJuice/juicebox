import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Search from '../search/search';
import Reactions from '../reactions/reactions';
import { addVideo } from './actions';
import Video from './video';
import VideoList from './video-list';
import './styles.scss';

class VideoPage extends Component {
  render() {
    const { queue, playing, playingStartTime } = this.props;

    return (
      <div className="video-page">
        <Video video={ playing } playingStartTime={ playingStartTime }/>
        <VideoList videos={ queue }
                   addVideo={ addVideo } />

        <Search streamId={ this.props.streamId } />
        <Reactions streamId={this.props.streamId} />
      </div>
    );
  }
}

VideoPage.propTypes = {
  addVideo: PropTypes.func.isRequired,
  queue: PropTypes.array,
  playing: PropTypes.object,
  streamId: PropTypes.string.isRequired,
  playingStartTime: PropTypes.number,
};

function mapStateToProps( { videos, router } ) {
  let streamId;
  if (router) {
    streamId = router.params.streamId;
  }

  let playingStartTime;
  if (videos.playingStartTime) {
    playingStartTime = Math.round(videos.playingStartTime / 1000);
  } else {
    playingStartTime = 0;
  }

  return Object.assign({}, videos,
    {
      playingStartTime,
      streamId,
    });
}

export default connect(mapStateToProps, { addVideo })(VideoPage);
