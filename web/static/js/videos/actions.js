const ADD_VIDEO = 'ADD_VIDEO';
const VIDEO_ADDED = 'VIDEO_ADDED';

const VIDEO_SAMPLES = [
  'fd02pGJx0s0',
  'lbjZPFBD6JU',
  'ZBseZ6y7hDQ',
  'uTxythHY09k',
  'tO4dxvguQDk',
  '6hXH5gKIWEA',
  'gzC29VwE1A'
];

function sampleVideo() {
  return VIDEO_SAMPLES[Math.floor(Math.random() * VIDEO_SAMPLES.length)];
}

function addVideo() {
  return {
    type: ADD_VIDEO,
    socketData: {
      event: 'video.added',
      payload: {
        video_id: sampleVideo()
      }
    }
  }
}

function videoAdded(video) {
  return {
    type: VIDEO_ADDED,
    video: video
  }
}

export {
  ADD_VIDEO,
  VIDEO_ADDED,
  addVideo,
  videoAdded
};