import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import AppContent from './containers/app-content';
import VideoList from './videos/video-list';

export default (
  <Route path="/" component={AppContent}>
    <Route path="stream/:streamId" component={VideoList} />
  </Route>
);
