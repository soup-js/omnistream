import React, { Component } from 'react';
import Rx from 'rxjs/Rx';
import Slider from './Slider';
import TimelineUnit from './TimelineUnit';
import createSuperstream from './superstream.js';
import { dragMovement$, currentlyDragging$ } from './actionStreams.js';
import reducer from './reducer.js';

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
  const sliderState$ = superstream.createStatestream(dragMovement$);
  const draggingState$ = superstream.createStatestream(currentlyDragging$);
  superstream.addToStore({ sliderState$, draggingState$ });
}


class Timeline extends Component {
  constructor(props, context) {
    super();
    this.superstream = context.superstream;
    addTimelinestore(this.superstream);
    this.state = { history: [] };
    this.history$ = this.superstream.history$;
    this.timeTravelToPointN = this.superstream.timeTravelToPointN.bind(this.superstream);
  }

  componentDidMount() {
    this.historyStream.subscribe((historyArray) => {
      this.setState({ history: historyArray });
    })
  }

  render() {
    return (
      <div id='timeline' style={STYLES}>
        <Slider />
        <div id='units' style={CONTAINER_STYLE}>
          {this.state.history.map((node, index) => {
            return <TimelineUnit key={index} styles={UNIT_STYLES} index={index} timeTravel={this.timeTravelToPointN} />
          })
          }
        </div>
      </div>
    )
  }
}

export default reactiveComponent(Timeline);