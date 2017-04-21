import shuffle from 'lodash/shuffle';

const frameAsset = require.context('../../images/frames', false);

const FRAMES = shuffle([
  'frame-1',
  'frame-2',
  'frame-3',
  'frame-4',
  'frame-5'
]);

const image = (src) => {
  const img = new Image();
  img.src = src;
  return img;
}

const frameAssets = (name) => ({
  frame: image(frameAsset(`./${name}.svg`)),
  mask: image(frameAsset(`./${name}-mask.svg`)),
});

export {
  frameAssets,
  FRAMES
};
