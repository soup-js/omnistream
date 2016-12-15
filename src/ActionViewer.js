import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { reactiveComponent } from './reactiveComponent.js';

const STYLE = {
    'wordWrap': 'break-word',
    'border': '1px solid rgb(235, 235, 235)',
    'padding': '5px',
    'bottom': '80',
    'position': 'relative',
    'minHeight': '20px',
    'maxWidth': '900px',
    'fontSize': '1.15em',
    'backgroundColor': '#fefefe',
}

function ActionViewer(props) {
  const {action} = props;
  return (
    <div className='timeline-action' style={STYLE}>
      <span>{JSON.stringify(action)}</span>
    </div>
  )
}

export default reactiveComponent(ActionViewer, 'draggingState$');