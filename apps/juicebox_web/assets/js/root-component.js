import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import AppRouter from './routes';

class Root extends Component {
  render() {
    const { store, history } = this.props;
    return (
      <Provider store={ store }>
        <AppRouter history={ history } />
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Root;
