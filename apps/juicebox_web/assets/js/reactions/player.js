import './styles.scss';
import React, { Component } from 'react';

class ReactionPlayer extends Component {
  constructor(props) {
    super(props);
    this.onLoop = this.onLoop.bind(this);
    this.state = { isNew: true };
  }

  onLoop() {
    this.setState({isNew: false});
    this.video.play();
  }

  componentWillReceiveProps({ reaction }) {
    if (reaction !== this.props.reaction) {
      this.setState({isNew: true});
    }
  }

  render() {
    return (
      <video
        className={ this.state.isNew ? 'new-reaction' : '' }
        autoPlay
        ref={ (video) => { this.video = video } }
        src={ this.props.reaction }
        onEnded={ this.onLoop }>
      </video>
    );
  }
}

export default ReactionPlayer;
