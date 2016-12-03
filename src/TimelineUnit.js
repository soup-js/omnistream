import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Rx from 'rxjs/Rx';

export default class extends Component {
  handleDoubleClick() {
    this.props.timeTravel(this.props.index);
  } 

  handleMouseEnter() {
    this.props.on ? this.props.timeTravel(this.props.index) : null
  }

  render() {
    return (
      <div className='timeline-unit' style={this.props.styles}
        onMouseEnter={() => this.handleMouseEnter()}
        onDoubleClick={() => this.handleDoubleClick()}>
        {this.props.index}
      </div>
    )
  }
}