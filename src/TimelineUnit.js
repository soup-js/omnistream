import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { reactiveComponent } from './reactiveComponent.js';
import Rx from 'rxjs/Rx';
import { updateView } from './actions.js';

const TimelineUnit = (props) => {
  const {dragging, index, timeTravel, styles, updateViewe, dispatch, node} = props;
  const handleMouseEnter = () => {
    dispatch(updateView(node));
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