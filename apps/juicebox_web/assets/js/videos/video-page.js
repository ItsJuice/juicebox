import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Search from '../search/search';
import Reactions from '../reactions/reactions';
import { addVideo } from './actions';
import Video from './video';
import VideoList from './video-list';
import styles from './video-page.scss';

class VideoPage extends Component {
  render() {
    const { queue, playing, playingStartTime } = this.props;

    return (
      <div className={ styles['video-page'] }>
        <Search streamId={ this.props.streamId } />
        <div className={ styles['main-column'] }>
          <Video video={ playing } playingStartTime={ playingStartTime }/>
          <Reactions streamId={this.props.streamId} />
        </div>
        <div className={ styles['side-column']} >
          <VideoList videos={ queue }
                     addVideo={ addVideo } />
        </div>

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

function mapStateToProps( { videos }, { match: { params: { streamId } } } ) {
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
