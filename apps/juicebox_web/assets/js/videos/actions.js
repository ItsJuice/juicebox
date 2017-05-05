const ADD_VIDEO = 'ADD_VIDEO';
const QUEUE_UPDATED = 'QUEUE_UPDATED';
const PLAYING_CHANGED = 'PLAYING_CHANGED';
const TOGGLE_EXPANDED = 'TOGGLE_EXPANDED';
const SKIP_PLAYING = 'SKIP_PLAYING';
const SKIP_RATIO_CHANGED = 'SKIP_RATIO_CHANGED';
const VOTED_DOWN = 'VOTED_DOWN';
const VOTED_UP = 'VOTED_UP';

function addVideo({ streamId, video }) {
  return {
    type: ADD_VIDEO,
    socketData: {
      event: 'video.added',
      payload: {
        stream_id: streamId,
        video: video
      }
    }
  };
}

function voteDown({ streamId, videoId }) {
  return {
    type: VOTED_DOWN,
    videoId,
    socketData: {
      event: 'video.vote_down',
      payload: {
        stream_id: streamId,
        video_id: videoId
      }
    }
  };
}

function voteUp({ streamId, videoId }) {
  return {
    type: VOTED_UP,
    videoId,
    socketData: {
      event: 'video.vote_up',
      payload: {
        stream_id: streamId,
        video_id: videoId
      }
    }
  };
}

function queueUpdated(videos) {
  return {
    type: QUEUE_UPDATED,
    videos: videos.queue
  };
}

function toggleExpanded() {
  return {
    type: TOGGLE_EXPANDED,
  }
}

function skipPlaying({ streamId }) {
  return {
    type: SKIP_PLAYING,
    socketData: {
      event: 'video.skip_playing',
      payload: {
        stream_id: streamId,
      }
    }
  };
}

export {
  ADD_VIDEO,
  QUEUE_UPDATED,
  PLAYING_CHANGED,
  TOGGLE_EXPANDED,
  SKIP_PLAYING,
  SKIP_RATIO_CHANGED,
  VOTED_DOWN,
  VOTED_UP,
  addVideo,
  queueUpdated,
  skipPlaying,
  toggleExpanded,
  voteDown,
  voteUp,
};
