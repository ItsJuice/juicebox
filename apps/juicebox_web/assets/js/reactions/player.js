import './styles.scss';
import React, { Component } from 'react';

class ReactionPlayer extends Component {
  render() {
    if (!this.props.reaction) {
      return (
        <div className="reaction"></div>
      );
    }

    return (
      <div className="reaction reaction-playing">
        <video
          autoPlay
          src={ this.props.reaction.video }
          onEnded={ this.props.onEnded }>
        </video>
      </div>
    );
  }
}

export default ReactionPlayer;
