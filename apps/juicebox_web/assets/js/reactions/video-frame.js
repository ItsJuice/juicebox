import React, { Component, PropTypes } from 'react';
const frameAsset = require.context('../../images/frames', false);

const image = (src) => {
  const img = new Image();
  img.src = src;
  return img;
}

const frameAssets = (name) => ({
  border: image(frameAsset(`./${name}.svg`)),
  mask: image(frameAsset(`./${name}-mask.svg`)),
});

class VideoFrame extends Component {
  constructor(props) {
    super(props);
    this.renderFrame = this.renderFrame.bind(this);
  }

  componentDidMount() {
    this.renderFrame();
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  renderFrame() {
    const ctx = this.canvas.getContext('2d');
    const { border, mask } = frameAssets(this.props.frame);

    const {
      naturalWidth: borderWidth,
      naturalHeight: borderHeight,
    } = border;

    this.resize(borderWidth, borderHeight);

    let { videoWidth, videoHeight } = this.video;
    const videoAspect = videoWidth / videoHeight;

    videoHeight = borderHeight;
    videoWidth = borderHeight * videoAspect;

    ctx.drawImage(mask, 0, 0, borderWidth, borderHeight);

    ctx.save();
      const videoX = (borderWidth / 2) - (videoWidth / 2);
      const videoY = (borderHeight / 2) - (videoHeight / 2);

      ctx.globalCompositeOperation = 'source-in';
      ctx.translate(videoX, videoY);
      ctx.drawImage(this.video, 0, 0, videoWidth, videoHeight);
    ctx.restore();

    ctx.drawImage(border, 0, 0, borderWidth, borderHeight);

    window.requestAnimationFrame(this.renderFrame);
  }

  render() {
    return (
      <div className="video-frame">
        <canvas ref={ (canvas) => { this.canvas = canvas } }></canvas>
        <video
          autoPlay
          loop
          ref={ (video) => { this.video = video } }
          src={ this.props.src }>
        </video>
      </div>
    );
  }
}

VideoFrame.propTypes = {
  src: PropTypes.string,
  frame: PropTypes.string,
};

export default VideoFrame;
