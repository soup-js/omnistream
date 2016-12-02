import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Rx from 'rxjs/Rx';

export default class extends Component {
  constructor(props) {
    super();
    this.handleMouseEnter = () => { 
      this.props.on ? this.props.timeTravel(this.props.index) : null };
    this.handleDoubleClick = () => this.props.timeTravel(this.props.index);
    }
  
  render() {
    return (
      <div className='timeline-unit'style={this.props.styles}
        onMouseEnter={this.handleMouseEnter}
        onDoubleClick={this.handleDoubleClick}>
        {this.props.index}
      </div>
    )
  }
}