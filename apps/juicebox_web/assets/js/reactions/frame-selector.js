import React, { Component, PropTypes } from 'react';
import { FRAMES, frameAssets } from './frames';

function _renderFrames() {
  return FRAMES.map((frame) => (
    <li key={frame} onClick={ this.props.onChange.bind(this, frame) }>
      <img src={ frameAssets(frame).frame.src } />
    </li>
  ), this);
}

class FrameSelector extends Component {
  constructor(props) {
    super(props);
    this.renderFrames = _renderFrames.bind(this);
  }

  render() {
    return (
      <ul className="frame-selector">
        { this.renderFrames() }
      </ul>
    );
  }
}

FrameSelector.propTypes = {
  onChange: PropTypes.func,
};

export default FrameSelector;
