import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import AppContent from './containers/app-content';
import VideoList from './videos/video-list';

export default (
  <Route component={AppContent}>
    <Route path="/" component={VideoList} />
  </Route>
);
