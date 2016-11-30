import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Rx from 'rxjs/Rx';

export default class extends Component {

  componentDidMount() {
    console.log(ReactDOM.findDOMNode(this).offsetLeft);
  }

  render() {
    return (
    <div className='timeline-unit'
      onMouseEnter={() => {
        this.props.on ? 
        this.props.timeTravel(this.props.index) :
        null
      }}
      onDoubleClick={() =>  this.props.timeTravel(this.props.index)}
      > {this.props.index} </div>
    )
  }
}