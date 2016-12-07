import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Rx from 'rxjs/Rx';

const TimelineUnit = (props) => {
  const {dragging, index, timeTravel, styles} = props;
  const handleMouseEnter = () => {
    dragging ? timeTravel(index) : void 0;
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