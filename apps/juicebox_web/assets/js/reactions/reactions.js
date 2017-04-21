import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { bindAll } from 'lodash/util';
import { sendReaction } from './actions';
import ReactionRecorder from './recorder';
import VideoFrame from './video-frame';
import FrameSelector from './frame-selector';
import { FRAMES } from './frames';
import styles from './styles.scss';
import classnames from 'classnames';
import ReactButton from './images/react-button.svg';
import show from '../lib/show-when';
import CloseIcon from '../common/close.svg';

class Reactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frame: FRAMES[0],
      open: false,
    };

    bindAll(this, 'setOpen', 'setClosed', 'sendAndClose');

    this.send = _send.bind(this);
    this.onFrameChange = _onFrameChange.bind(this);
  }

  reactions() {
    return map(this.props.reactions, ({ video, frame }, userId) => {
      return (
        <div className={styles['reaction-list-item']}>
          <VideoFrame src={video}
                      frame={frame}
                      key={userId}
                      className={styles['video-frame']} />
        </div>
      );
    });
  }

  sendAndClose(video) {
    this.send(video);
    this.setClosed();
  }

  setOpen() {
    this.setState({ open: true })
  }

  setClosed() {
    this.setState({ open: false })
  }

  recorder = () => (
    <ReactionRecorder
      onRecord={ this.sendAndClose }
      frame={ this.state.frame }
    />
  );

  render() {
    const { open } = this.state;
    const classes = classnames(styles.reactions, { [styles.open]: open });

    return (
      <div className={ classes }>
        <div className={ styles['reactions-modal']}>
          <CloseIcon className={ styles['close-btn'] }
                     onClick={ this.setClosed } />

          <div className={ styles['reactions-container']}>
            <div className={ styles['side-column'] }>
              <h2>Choose your frame</h2>
              <div className={ styles['frame-scroller'] }>
                <FrameSelector onChange={ this.onFrameChange }
                  selected={ this.state.frame }
                  className={ styles['frame-selector'] } />
              </div>
            </div>

            <div className={ styles['main-column'] }>
              <h2>Strike a pose</h2>
              { show(this.recorder).when(open) }
            </div>
          </div>
        </div>

        <div className={ styles['reaction-list'] }>
          <div className={styles['reaction-list-item']}
               onClick={ this.setOpen }>
            <div className={styles['reaction-button']}>
              <ReactButton />
            </div>
          </div>
          { this.reactions() }
        </div>
      </div>
    );
  }
}

Reactions.propTypes = {
  reactions: PropTypes.shape({
    video: PropTypes.string,
    userId: PropTypes.string,
    frame: PropTypes.string,
  }),
};

function _onFrameChange(frame) {
  this.setState({ frame });
}

function _send(video) {
  this.props.sendReaction({
    streamId: this.props.streamId,
    frame: this.state.frame,
    video
  });
}

function mapStateToProps(state) {
  return {
    reactions: state.reactions
  }
}

export default connect(mapStateToProps, { sendReaction })(Reactions);
