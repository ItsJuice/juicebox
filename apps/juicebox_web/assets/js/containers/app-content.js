import React, { Component } from 'react';
import { connect } from 'react-redux';
import VideoList from '../videos/video-list';

class AppContent extends Component {

  render() {
    const videos = this.props.videos;

    return (
      <main className="app">
        { this.props.children }
      </main>
    );
  }
}

export default AppContent;
