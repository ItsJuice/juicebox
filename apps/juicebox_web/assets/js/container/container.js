import React, { Component } from 'react';
import styles from './container.scss'; // eslint-disable-line no-unused-vars

class Container extends Component {

  render() {
    return (
      <main className="app">
        { this.props.children }
      </main>
    );
  }
}

Container.propTypes = {
  children: React.PropTypes.node
}

export default Container;
