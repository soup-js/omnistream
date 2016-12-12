import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { reactiveComponent } from './reactiveComponent.js';
import Rx from 'rxjs/Rx';

const TimelineUnit = (props) => {
  const {dragging, index, timeTravel, styles} = props;
  const handleMouseEnter = () => {
    dragging ? timeTravel(index) : undefined;
  }

  return (
    <div className='timeline-unit' style={styles}
      onMouseEnter={handleMouseEnter}
      onDoubleClick={() => timeTravel(index)}>
      {index}
    </div>
  )
}

export default reactiveComponent(TimelineUnit, 'draggingState$');