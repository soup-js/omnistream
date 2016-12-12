import { Observable } from 'rxjs/Rx';
import { drag, stopDrag, startDrag } from './actions.js';

const click$ = Observable.fromEvent(document, 'click');
const sliderClick$ = click$.filter((e) => e.target.id === 'sliderBar');
const nonsliderClick$ = click$.filter((e) => (e.target.id !== 'sliderBar'));
const mouseMove$ = Observable.fromEvent(document, 'mousemove');

const currentlyDragging = (superstream) => superstream.filter(x => x.type === 'MOUSE_LEAVE')
  .map(x => 'stop')
  .merge(sliderClick$.map(x => 'slider'))
  .merge(nonsliderClick$.map(x => 'nonslider'))
  .scan((dragging, val) => {
    if (val === 'slider') return !dragging;
    if (val === 'nonslider' || val === 'stop') return false;
  }, false)
  .map(dragging => (console.log('dragging', dragging), dragging ? startDrag() : stopDrag()))

const dragMovement = (superstream) => {
  return superstream.filterForActionTypes('STOP_DRAG', 'START_DRAG')
    .switchMap((dragging) => {
      return dragging.type === 'STOP_DRAG' ? Observable.never() : mouseMove$
    })
    .map(e => drag(e.pageX))
};

export { dragMovement, currentlyDragging };