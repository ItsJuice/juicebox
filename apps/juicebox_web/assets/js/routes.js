import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import AppContent from './containers/app-content';
import VideoList from './videos/video-list';
import Reactions from './reactions/reactions';

export default (
  <Route path="/" component={AppContent}>
    <Route path="stream/:streamId" component={VideoList} />
    <Route path="react/:streamId" component={Reactions} />
  </Route>
);
