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
    this.historyStream = props.upstream.historyStream;
    this.state = { history: [], barPosition: '10px', dragging: false }
    this.timeTravelToPointN = props.upstream.timeTravelToPointN.bind(props.upstream);
    this.dragging = (result) => { this.setState(result) }
  }

  componentDidMount() {
    this.historyStream.subscribe((historyArray) => {
      this.setState({ history: historyArray });
    })
  }
  render() {
    return (
      <div id='timeline' style={STYLES}>
        <Slider handleDrag={this.dragging} isDragging={this.state.dragging} />
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