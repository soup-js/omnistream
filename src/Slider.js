import React, { Component } from 'react';
import reactiveComponent from './reactiveComponent.js';
import Rx from 'rxjs/Rx';

const STYLES = {
  width: '10px',
  height: '70px',
  backgroundColor: 'rgba(0, 97, 128, 0.682353)',
  position: 'relative',
  left: 10,
  zIndex: 1,
}

const Slider = (props) => {
  const {dragging, barPosition} = props;
  const zIndex = dragging ? -1 : 1;
  const updatedStyles = Object.assign({}, STYLES, {
    left: barPosition,
    zIndex: zIndex
  });
  return (
    <div id="sliderBar" style={updatedStyles}></div>
  )
}

export default reactiveComponent(Slider, 'sliderState$', 'draggingState$');