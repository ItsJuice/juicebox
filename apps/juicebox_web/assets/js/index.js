import React from 'react';
import { render } from 'react-dom';
import Root from './containers/root';
import configureStore from './stores/main-store'

const initialState = {
  videos: []
};

const appInit = () => {
  const store = configureStore({});

  const rootElement = document.getElementById('main');
  document.body.appendChild(rootElement);

  render(<Root store={store} />, rootElement);
};

document.addEventListener('DOMContentLoaded', appInit, false);
