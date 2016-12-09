import React, { Component } from 'react';

class Result extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="result">
        <li>
          <div>{this.props.result.title}</div>
          <div>{this.props.result.thumbnail}</div>
        </li>
      </div>
    );
  }
}

export default Result;
