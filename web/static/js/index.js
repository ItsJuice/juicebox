import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.js';

const rootElement = document.createElement('div');
document.body.appendChild(rootElement);

ReactDOM.render(<App />, rootElement);
