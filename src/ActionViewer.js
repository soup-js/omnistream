import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { reactiveComponent } from './reactiveComponent.js';

const STYLE = {
    'maxHeight': '25px',
    'wordWrap': 'break-word',
    'border': '1px solid rgb(235, 235, 235)',
    'padding': '5px',
    'bottom': '80',
    'position': 'absolute',
    'minHeight': '20px',
    'maxWidth': '900px',
    'fontSize': '1.15em',
    'backgroundColor': '#fefefe',
}

function ActionViewer(props) {
  const {action} = props;
  return (
    <div className='timeline-action' style={STYLE}>
      {JSON.stringify(action)}
    </div>
  )
}

export default reactiveComponent(ActionViewer, 'draggingState$');