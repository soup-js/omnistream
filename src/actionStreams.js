import { Observable } from 'rxjs/Rx';
import { drag, stopDrag, startDrag } from './actions.js';

const click$ = Observable.fromEvent(document, 'click');
const sliderClick$ = click$.filter((e) => e.target.id === 'sliderBar');
const nonsliderClick$ = click$.filter((e) => (e.target.id !== 'sliderBar'));
const mouseMove$ = Observable.fromEvent(document, 'mousemove');
const mouseLeave$ = Observable.fromEvent(document, 'mouseout').filter((e) => {
  const target = e.srcElement || e.originalTarget;
  return (e.target.id === 'timeline')
});

const currentlyDragging$ = sliderClick$.map(x => 'slider')
  .merge(nonsliderClick$.map(x => 'nonslider'))
  .scan((acc, val) => {
    if (val === 'slider') return !acc;
    if (val === 'nonslider' && acc) return !acc;
    return false
  }, false)

const currentlyDragging = (superstream) => currentlyDragging$
  .map(dragging => dragging ? startDrag() : stopDrag())

const clickWhileDragging$ = currentlyDragging$
  .switchMap((value) => !value ? sliderClick$ : Observable.never());

const dragMovement = (superstream) => currentlyDragging$
  .switchMap((value) =>
    value ? mouseMove$ : Observable.never()
  )
  .map(e => drag(e.pageX));

export { dragMovement, currentlyDragging };