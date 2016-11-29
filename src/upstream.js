const Rx = require('rxjs/Rx');

class Upstream {
  constructor() {
    this.stream = new Rx.BehaviorSubject();
  }

  dispatch(data) {
    if (!(data.hasOwnProperty('data') && data.hasOwnProperty('type'))) {
      throw new Error('Actions dispatched upstream must be objects with data and type properties')
    }
    this.stream.next(data);
  }

  filterForAction(actionType) {
    return this.stream.filter(el => {
      return el ? (el.type === actionType) : el
    })
      .map(el => el ? el.data : el)
  }
}

export default function createUpstream() {
  return new Upstream();
}