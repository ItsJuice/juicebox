import React, { Component } from 'react';
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
          {this.results().map(result => <Result result={result} />)}
        </ul>
      </div>
    );
  }
}

export default ResultList;
