import React, { Component, PropTypes } from 'react';
import { FRAMES, frameAssets } from './frames';
import styles from './styles.scss';

function _renderFrames() {
  const { selected } = this.props;

  return FRAMES.map((frame) => (
    <li
      className={ selected == frame ? styles.selected : '' }
      key={frame}
      onClick={ this.props.onChange.bind(this, frame) }
      style={{ backgroundImage: `url(${frameAssets(frame).frame.src})` }}>
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
      <ul className={ this.props.className }>
        { this.renderFrames() }
      </ul>
    );
  }
}

FrameSelector.propTypes = {
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default FrameSelector;
