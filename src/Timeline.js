import React, { Component } from 'react';
import Rx from 'rxjs/Rx';
require("./styles/timeline-style.css")

class Timeline extends Component {
  constructor(props) {
    super();
    this.historyStream = props.upstream.historyStream;
    this.state = { history: [], barPosition: '10px', dragging: false }
    this.timeTravelToPointN = props.upstream.timeTravelToPointN.bind(props.upstream);
  }

  componentDidMount() {
    this.historyStream.subscribe((historyArray) => {
      this.setState({ history: historyArray });
    })

    this.mousedownAnywhere = Rx.Observable.fromEvent(document, 'mousedown');
    this.mouseup = Rx.Observable.fromEvent(document, 'mouseup');
    this.mousemove = Rx.Observable.fromEvent(document, 'mousemove');
    this.mousedown = Rx.Observable.fromEvent(document.getElementById('sliderBar'), 'mousedown');
    this.mouseleave = Rx.Observable.fromEvent(document.getElementById('timeline'), 'mouseleave')
    const mouseDrag = this.mousedown.flatMap(() => {
      return this.mousemove.takeUntil(this.mousedownAnywhere.skip(1).merge(this.mouseleave));
    });
    const stopDragging = this.mousedown.flatMap(() => {
      return this.mousedownAnywhere.skip(1).merge(this.mouseleave)
    })
    mouseDrag.subscribe((e) => {
      this.setState({ barPosition: e.clientX });
      this.setState({ dragging: true });
    });
    stopDragging.subscribe((e) => {
      this.setState({dragging: false});
    })
  }

  render() {
    const styles = {
      left: this.state.barPosition
    }

    return (
      <div id='timeline'>
        <div id="sliderBar" style={styles}></div>
        {this.state.history.map((node, index) => {
          return <div className='timeline-unit' key={index}
            onMouseOver={() => {
              console.log('hover' + Date.now())
              return this.timeTravelToPointN(index)}
            }> {index} </div>
        })}
      </div>
    )
  }
}


export default Timeline;