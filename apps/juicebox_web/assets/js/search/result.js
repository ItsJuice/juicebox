import React, { Component } from 'react';

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
      <div className="result">
        <li onClick={this.select}>
          <div>{this.props.result.title}</div>
          <div>{this.props.result.thumbnail}</div>
        </li>
      </div>
    );
  }
}

export default Result;
