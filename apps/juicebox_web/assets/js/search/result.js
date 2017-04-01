import React, { Component, PropTypes } from 'react';
import styles from './results.scss';

class Result extends Component {
  constructor(props) {
    super(props);
    this.select = this.select.bind(this);
  }

  select() {
    this.props.onSelect(this.props.result);
  }

  render() {
    return (
      <div className={ styles.result }>
        <li onClick={this.select}>
          <img src={this.props.result.thumbnail} />
          <span>{this.props.result.title}</span>
        </li>
      </div>
    );
  }
}

Result.propTypes = {
  result: PropTypes.shape({
    title: PropTypes.title,
    thumbnail: PropTypes.thumbnail,
  }),
  onSelect: PropTypes.func,
};

export default Result;
