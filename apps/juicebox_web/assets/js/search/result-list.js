import React, { Component, PropTypes } from 'react';
import Result from './result';

class ResultList extends Component {
  constructor(props) {
    super(props);
  }

  results() {
    return this.props.results || [];
  }

  render() {
    return (
      <div className="result-list">
        <h2>Results</h2>
        <ul>
          {this.results().map(result => <Result result={result} onSelect={ this.props.onSelect } />)}
        </ul>
      </div>
    );
  }
}

ResultList.propTypes = {
  onSelect: PropTypes.func,
  results: PropTypes.array,
};

export default ResultList;
