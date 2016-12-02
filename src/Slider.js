import React, { Component } from 'react';
import Rx from 'rxjs/Rx';

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
    const sliderClick$ = Rx.Observable.fromEvent(document.getElementById('sliderBar'), 'click');
    const nonsliderClick$ = Rx.Observable.fromEvent(document, 'click').filter((e) => (e.target.id !== 'sliderBar'));
    const mouseMove$ = Rx.Observable.fromEvent(document, 'mousemove');
    const mouseLeave$ = Rx.Observable.fromEvent(document.getElementById('timeline'), 'mouseleave')

    const currentlyDragging$ = mouseLeave$.map(x => false)
      .merge(sliderClick$.map(x => 'slider'))
      .merge(nonsliderClick$.map(x => 'nonslider'))
      .scan((acc, val) => {
        if (val === 'slider') return !acc;
        if (val === 'nonslider' && acc) return !acc;
        return false
      }, false)

    const mouseMovement$ = currentlyDragging$
      .switchMap((value) => {
        return value ? mouseMove$ : Rx.Observable.never()
      })

    const clickWhileDragging$ = currentlyDragging$
      .switchMap((value) => !value ? sliderClick$ : Rx.Observable.never());

    const stopDragging$ = clickWhileDragging$.switchMap(() => {
      return clickWhileDragging$.merge(mouseLeave$)
    });

    mouseMovement$.subscribe((e) => {
      this.setState({ barPosition: e.pageX });
    });
    currentlyDragging$.subscribe((e) => {
      console.log('currently dragging', e);      
      this.props.handleDrag({ dragging: e });
    })
  }

  render() {
    console.log('slider is dragging:', this.props.isDragging)
    const zIndex = this.props.isDragging ? -1 : 1;
    const updatedStyles = Object.assign({}, STYLES, {
      left: this.state.barPosition,
      zIndex: zIndex
    });
    return (
      <div id="sliderBar" style={updatedStyles}></div>
    )
  }
}

export default Slider;