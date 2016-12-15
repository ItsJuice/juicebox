const ADD_VIDEO = 'ADD_VIDEO';
const LOAD_STATE = 'ADD_VIDEO';
const QUEUE_UPDATED = 'QUEUE_UPDATED';
const PLAYING_CHANGED = 'PLAYING_CHANGED';
const RECEIVE_TERM = 'RECEIVE_TERM';
const RECEIVE_RESULTS = 'RECEIVE_RESULTS';

const VIDEO_SAMPLES = [
  'fd02pGJx0s0',
  'lbjZPFBD6JU',
  'ZBseZ6y7hDQ',
  'uTxythHY09k',
  'tO4dxvguQDk',
  '6hXH5gKIWEA',
  'gzC29VwE1A',
];

function sampleVideo() {
  return VIDEO_SAMPLES[Math.floor(Math.random() * VIDEO_SAMPLES.length)];
}

function receiveResults(results) {
  return {
    type: RECEIVE_RESULTS,
    payload: results,
  };
}

function receiveTerm({ term }) {
  return dispatch => {
    fetch(`/api/videos?q=${term}`, {
      method: 'get'
    }).then(function(response) {
      if (response.status === '500') {
        // Handle response errors
      } else {
        const results = response.body.videos || [];
        dispatch(receiveResults(results));
      }
    }).catch(function(error) {
      // Handle request errors
    });
  };
}

function addVideo({ streamId }) {
  return {
    type: ADD_VIDEO,
    socketData: {
      event: 'video.added',
      payload: {
        stream_id: streamId,
        video: {
          video_id: sampleVideo(), // pending: proper value from youtube
          duration: 30000,         // pending: proper value from youtube
        }
      }
    }
  };
}

function loadInitialState() {
  return {
    type: LOAD_STATE,
    socketData: {
      event: 'video.getState',
      payload: {
        stream_id: 'main',
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

export {
  ADD_VIDEO,
  QUEUE_UPDATED,
  PLAYING_CHANGED,
  RECEIVE_TERM,
  RECEIVE_RESULTS,
  receiveTerm,
  receiveResults,
  addVideo,
  queueUpdated,
  loadInitialState,
};
