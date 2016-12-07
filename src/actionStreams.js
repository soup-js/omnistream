import { Observable } from 'rxjs/Rx';
import { dragMovement, stopDragging, startDragging } from './actions.js';

const click$ = Observable.fromEvent(document, 'click');
const sliderClick$ = click$.filter((e) => e.target.id === 'sliderBar');
const nonsliderClick$ = click$.filter((e) => (e.target.id !== 'sliderBar'));
const mouseMove$ = Observable.fromEvent(document, 'mousemove');
const mouseLeave$ = Observable.fromEvent(document, 'mouseleave').filter((e) => (e.target.id === 'timeline'));

const currentlyDragging$ = mouseLeave$.map(x => false)
  .merge(sliderClick$.map(x => 'slider'))
  .merge(nonsliderClick$.map(x => 'nonslider'))
  .scan((acc, val) => {
    if (val === 'slider') return !acc;
    if (val === 'nonslider' && acc) return !acc;
    return false
  }, false)
  .map(dragging => dragging ? startDragging() : stopDragging())

const clickWhileDragging$ = currentlyDragging$
  .switchMap((value) => !value ? sliderClick$ : Rx.Observable.never());

const dragMovement$ = currentlyDragging$
  .switchMap((value) =>
    value ? mouseMove$ : Rx.Observable.never()
  )
  .map(e => dragMovement(e.pageX));

const stopDragging$ = clickWhileDragging$.switchMap(() => (
  clickWhileDragging$.merge(mouseLeave$)))
  .map(() => stopDragging());

export {dragMovement$, currentlyDragging$};