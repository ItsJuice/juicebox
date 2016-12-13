import React from 'react';
import { Route } from 'react-router';
import AppContent from './containers/app-content';
import VideoPage from './videos/video-page';

export default (
  <Route path="/" component={AppContent}>
    <Route path="stream/:streamId" component={VideoPage} />
  </Route>
);
