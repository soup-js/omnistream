const Rx = require('rxjs/Rx');

class Superstream {
  // Instatiates a new stream to manage state for the application
  constructor() {
    this.stream = new Rx.BehaviorSubject();
    // Creates an array to hold all actions dispatched within an application. 
    // This feature allows for time travel debugging in O(n) space.
    this.history = [];
    this.store = {};
    this.getHistory();
  }

  // Creates a state-stream with provided reducer and action stream
  createStatestream(reducer, actionStream) {
    return actionStream(this)
      .merge(this.stream.filter(value => value ? value._clearState : false))
      .startWith(reducer(undefined, {type: null}))
      .scan((acc, curr) => (
      curr._clearState ? reducer(undefined, {type: null}) : reducer(acc, curr)
    ))
  }

  // Creates a collection of all state-streams
  createStore(streamCollection) {
    this.store = streamCollection;
  }

  // Check whether each action dispatched has data and type properties. 
  // If so, pass the action to the superstream.
  dispatch(action) {
    if (!(action.hasOwnProperty('type') && !(action._clearState))) {
      throw new Error('Actions dispatched to superstream must be objects with type properties')
    }
    this.stream.next(action);
  }
  // Dispatch an observable to the superstream
  dispatchSideEffect(streamFunction) {
    const sideEffectStream = streamFunction(this.stream.filter(action => action).skip(1));
    sideEffectStream.subscribe((action) => {
      this.dispatch(action);
    })
  }

  // Store a reference to every action type that passes through the stream.
  recordActionTypes() {
    this.actionStream = this.stream.filter(action => action).map(action => action.type)
    this.actionStream.subscribe(type => this.setOfAllActionTypes[type] = true);
  }

  // Create an observable of data for a specific action type.
  filterForActionTypes(...actionTypes) {
    const actions = Array.isArray(actionTypes[0]) ? actionTypes[0] : actionTypes;
    const hash = actions.reduce((acc, curr) => Object.assign(acc, {[curr]: true}), {});
    console.log(hash);
    return this.stream.filter(action => {
      return action ? (hash[action.type]) : false
    })
  }

  // Create an observable that updates history when a new action is received.
  getHistory() {
    this.historyStream = this.stream.filter(action => action && !action._ignore)
      .scan((acc, cur) => {
        console.log('current action', cur);
        acc.push(cur);
        return acc;
      }, [])
      .publish()
    this.historyStream.connect();
    this.historyStream.subscribe(el => this.history = el)
  }

  // Revert the app back to its original state
  clearState() {
    this.stream.next({_clearState: true, _ignore: true});
  }

  timeTravelToPointN(n) {
    this.clearState();
    for (let i = 0; i <= n; i++) {
      this.dispatch(Object.assign({_ignore: true }, this.history[i]));
    }
  }
}

export default function createSuperstream() {
  return new Superstream();
}
