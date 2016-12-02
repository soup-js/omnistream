import React, { Component } from 'react';
import Rx from 'rxjs/Rx';
import Slider from './Slider';
import TimelineUnit from './TimelineUnit';

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

class Timeline extends Component {
  constructor(props) {
    super();
    this.historyStream = props.superstream.historyStream;
    this.state = { history: [], dragging: false }
    this.timeTravelToPointN = props.superstream.timeTravelToPointN.bind(props.superstream);
    this.setDraggingState = this.setDraggingState.bind(this);
  }

  setDraggingState(result) {
    console.log('handledrag', result);
    this.setState(result);
    console.log('state.dragging:', this.state.dragging);
  }

  componentDidMount() {
    this.historyStream.subscribe((historyArray) => {
      this.setState({ history: historyArray });
    })
  }

  render() {
    return (
      <div id='timeline' style={STYLES}>
        <Slider handleDrag={this.setDraggingState} isDragging={this.state.dragging} />
        <div id='units' style={CONTAINER_STYLE}>
          {this.state.history.map((node, index) => {
            return <TimelineUnit key={index} styles={UNIT_STYLES} index={index} on={this.state.dragging} timeTravel={this.timeTravelToPointN} />
          })
          }
        </div>
      </div>
    )
  }
}


export default Timeline;