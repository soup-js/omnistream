import React, { Component } from 'react';
import Rx from 'rxjs/Rx';
import Slider from './Slider';
import TimelineUnit from './TimelineUnit';
import createSuperstream from './superstream.js';
import ActionViewer from './ActionViewer.js';
import { reactiveTimeline } from './reactiveComponent.js';
import { dragMovement, currentlyDragging } from './actionStreams.js';
import { dragReducer, barPositionReducer } from './reducer.js';
import { stopDrag, mouseLeave } from './actions';

const STYLES = {
  position: 'fixed',
  backgroundColor: '#f4f4f4',
  overflowX: 'scroll',
  whiteSpace: 'nowrap',
  width: '100%',
  height: '70px',
  bottom: '0px',
  borderTop: '1px solid #b0b0b0'
}

const MAIN_CONTAINER_STYLES = {
  fontFamily: 'monospace',
  position: 'fixed',
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  bottom: '0',
  height: '115px'
}

const UNIT_STYLES = {
  display: 'inline-block',
  zIndex: 0,
  height: '70px',
  marginTop: '-70px',
  borderLeft: '1px solid #909090',
  width: '24px',
  textAlign: 'center',
  lineHeight: '70px',
  marginLeft: '5px'
}

const CONTAINER_STYLE = {
  fontWeight: '200',
  fontSize: '.75em',
  position: 'relative',
  bottom: '40px',
}


const draggingStateFn = (superstream) => {
  return superstream.filterForActionTypes(['START_DRAG', 'STOP_DRAG', 'SELECT_ACTION'])
}

// setup OMNISTREAMS
const addTimelinestore = (superstream) => {
  const sliderState$ = superstream._createTimelineStatestream(barPositionReducer, dragMovement);
  const draggingState$ = superstream._createTimelineStatestream(dragReducer, draggingStateFn);
  superstream.addToStore({ sliderState$, draggingState$ });
}


class Timeline extends Component {
  constructor(props) {
    super(props);
    this.superstream = this.props.superstream;
    addTimelinestore(this.superstream);
    this.state = { history: [] };
    this.history$ = this.superstream.history$;
    this.timeTravelToPointN = this.superstream.timeTravelToPointN.bind(this.superstream);
  }

  componentDidMount() {
    this.history$.subscribe((historyArray) => {
      this.setState({ history: historyArray });
    })
    this.props.dispatchObservableFn(currentlyDragging);
    this.listener = document.getElementById('timeline').addEventListener('mouseleave', (x) => {
      this.props.dispatch(mouseLeave());
    });
  }

  compomentWillUnmount() {
    document.getElementById('timeline').removeEventListener(this.listener);
  }

  render() {
    const units = this.state.history.map((node, index) => {
      return <TimelineUnit key={index} styles={UNIT_STYLES} index={index} node={node} timeTravel={this.timeTravelToPointN} />
    })
    return (
      <div id='timeline-container' style={MAIN_CONTAINER_STYLES}>
      <ActionViewer history={this.state.history}/>
      <div id='timeline' style={STYLES}>
        <Slider />
        <div id='units' style={CONTAINER_STYLE}>
          {units}
        </div>
      </div>
      </div>
    )
  }
}

export default reactiveTimeline(Timeline);