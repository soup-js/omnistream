import React, { Component } from 'react';
import Rx from 'rxjs/Rx';
//TODO: get rid of react warning that styles are being mutated
const STYLES = {
  width: '10px',
  height: '70px',
  backgroundColor: 'rgba(0, 97, 128, 0.682353)',
  position: 'relative',
  left: 10,
  zIndex: 1,
}

class Slider extends Component {
  constructor(props) {
    super();
    this.state = { barPosition: 100 }
  }

  componentDidMount() {
    this.nonsliderClick = Rx.Observable.fromEvent(document, 'click').filter((e) => (e.target.id !== 'sliderBar'));
    this.sliderClick = Rx.Observable.fromEvent(document.getElementById('sliderBar'), 'click');
    this.mousemove = Rx.Observable.fromEvent(document, 'mousemove');

    // this stream can be combined below to stop time travel when cursor leaves timeline area
    this.mouseleave = Rx.Observable.fromEvent(document.getElementById('timeline'), 'mouseleave')

    this.currentlyDragging = this.mouseleave.map(x => false)
      .merge(this.sliderClick.map(x => 'slider'))
      .merge(this.nonsliderClick.map(x => 'nonslider'))
      .scan((acc, val) => {
        if (val === 'slider') return !acc;
        if (val === 'nonslider' && acc) return !acc;
        return false
      }, false)

    this.mouseMovement = this.currentlyDragging
      .switchMap((value) => {
        return value ? this.mousemove : Rx.Observable.never()
      })

    this.clickWhileDragging = this.currentlyDragging
      .switchMap((value) => !value ? this.sliderClick : Rx.Observable.never());

    const stopDragging = this.clickWhileDragging.switchMap(() => {
      return this.clickWhileDragging.merge(this.mouseleave)
    });

    this.mouseMovementSub = this.mouseMovement.subscribe((e) => {
      this.setState({ barPosition: e.pageX });
    });
    this.currentlyDragging.subscribe((e) => {
      this.props.handleDrag({ dragging: e });
    })
  }

  componentWillUnmount() {
    this.mouseDrag.unsubscribe();
    this.stopDragging.unsubscribe();
  }

  render() {
    const zIndex = this.props.isDragging ? -1 : 1;
    const updatedStyles = Object.assign({}, STYLES, {
      left: this.state.barPosition,
      'zIndex': zIndex
    });
    return (
      <div id="sliderBar" style={updatedStyles}></div>
    )
  }
}


export default Slider;