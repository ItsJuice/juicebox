import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Search from '../search/search';
import Reactions from '../reactions/reactions';
import { addVideo, toggleExpanded, voteDown, voteUp, skipPlaying } from './actions';
import Video from './video';
import VideoList from './video-list';
import styles from './video-page.scss';

class VideoPage extends Component {
  render() {
    const {
      expanded,
      playing,
      playingStartTime,
      queue,
      skipPlaying,
      skipRatio,
      streamId,
      toggleExpanded,
      votes,
      voteDown,
      voteUp,
    } = this.props;

    return (
      <div className={ styles['video-page'] }>
        <Search streamId={ streamId } />
        <div className={ styles['main-column'] }>
          <Video video={ playing }
                 playingStartTime={ playingStartTime }
                 expanded={ expanded }
                 toggleExpanded={ toggleExpanded }
                 skipPlaying={ skipPlaying }
                 skipRatio={ skipRatio }
                 streamId={ streamId }
          />
          <Reactions streamId={ streamId } />
        </div>
        <div className={ styles['side-column']} >
          <VideoList addVideo={ addVideo }
                     streamId={ streamId }
                     videos={ queue }
                     votes={ votes }
                     voteDown={ voteDown }
                     voteUp={ voteUp }
          />
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
  expanded: PropTypes.bool,
  toggleExpanded: PropTypes.func,
  skipPlaying: PropTypes.func,
  skipRatio: PropTypes.number,
  votes: PropTypes.object,
  voteDown: PropTypes.func,
  voteUp: PropTypes.func,
};

function mapStateToProps( { videos }, { match: { params: { streamId } } } ) {
  return Object.assign({}, videos, { streamId });
}

export default connect(mapStateToProps, {
  addVideo,
  skipPlaying,
  toggleExpanded,
  voteUp,
  voteDown,
})(VideoPage);
