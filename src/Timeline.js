import React, { Component } from 'react';
import Rx from 'rxjs/Rx';
import Slider from './Slider';
import TimelineUnit from './TimelineUnit';
import createSuperstream from './superstream.js';
import reactiveComponent from './reactiveComponent.js';
import { dragMovement, currentlyDragging } from './actionStreams.js';
import { dragReducer, barPositionReducer } from './reducer.js';

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
  fontSize: '.75em'
}

// setup OMNISTREAMS
const addTimelinestore = (superstream) => {
  const sliderState$ = superstream._createTimelineStatestream(barPositionReducer, dragMovement);
  const draggingState$ = superstream._createTimelineStatestream(dragReducer, currentlyDragging);
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
  }

  render() {
    const units = this.state.history.map((node, index) => {
      return <TimelineUnit key={node} styles={UNIT_STYLES} index={index} timeTravel={this.timeTravelToPointN} />
    })
    return (
      <div id='timeline' style={STYLES}>
        <Slider />
        <div id='units' style={CONTAINER_STYLE}>
          {units}
        </div>
      </div>
    )
  }
}

export default reactiveComponent(Timeline);