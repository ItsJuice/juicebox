import React, { Component, PropTypes } from 'react';
import VideoPlaceholder from './video-placeholder';

class VideoList extends Component {
  render() {
    const { streamId, videos, votes, voteDown, voteUp } = this.props;
    return (
      <div className="video-list">
        <h2>Up next</h2>
        {videos && videos.map(({video}, index) => (
          <VideoPlaceholder key={ index }
                            streamId={ streamId }
                            video={ video }
                            vote={ votes[video.video_id] }
                            voteDown={ voteDown }
                            voteUp={ voteUp } />
        ))}
      </div>
    );
  }
}

VideoList.propTypes = {
  streamId: PropTypes.string.isRequired,
  videos: PropTypes.array,
  votes: PropTypes.object,
  voteDown: PropTypes.func,
  voteUp: PropTypes.func,
}

export default VideoList;
