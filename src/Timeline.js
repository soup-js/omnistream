import React, { Component } from 'react';
import Rx from 'rxjs/Rx';
import Slider from './Slider';
import TimelineUnit from './TimelineUnit';

const styles = {
    position: 'fixed',
    backgroundColor: 'orange',
    width: '100%',
    height: '70px',
    bottom: '0px',
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
    const styles = {
      left: this.state.barPosition
    }
    return (
        <div id='timeline' style={styles}>
          <Slider handleDrag={this.dragging} isDragging={this.state.dragging} />
          <div id='units'>
            {this.state.history.map((node, index) => {
              return <TimelineUnit key={index} index={index} on={this.state.dragging} timeTravel={this.timeTravelToPointN} />
            })
            }
          </div>
        </div>
    )
  }
}


export default Timeline;