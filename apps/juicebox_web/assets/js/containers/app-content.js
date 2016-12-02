import React, { Component } from 'react';
import { connect } from 'react-redux';
import VideoList from '../videos/video-list';
import Search from '../videos/search';

class AppContent extends Component {

  render() {
    const videos = this.props.videos;

    return (
      <main className="app">
        <Search />
        { this.props.children }
      </main>
    );
  }
}

export default AppContent;
