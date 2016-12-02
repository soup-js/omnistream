const Rx = require('rxjs/Rx');

class Superstream {
  // Instatiates a new stream to manage state for the application
  constructor() {
    this.stream = new Rx.BehaviorSubject();
  // Creates an array to hold all actions dispatched within an application. 
  // This feature allows for time travel debugging in O(n) space.
    this.history = [];
    this.setOfAllActionTypes = {};
    this.getHistory();
    this.recordActionTypes();
  }

  // Check whether each action dispatched has data and type properties. 
  // If so, pass the action to the superstream.
  dispatch(data) {
    if (!(data.hasOwnProperty('data') && data.hasOwnProperty('type'))) {
      throw new Error('Actions dispatched to superstream must be objects with data and type properties')
    }
    this.stream.next(data);
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
  filterForAction(actionType) {
    return this.stream.filter(action => {
      return action ? (action.type === actionType) : action
    })
      .map(action => action ? action.data : action)
  }

  // Create an observable that updates history when a new action is received.
  getHistory() {
    this.historyStream = this.stream.filter(action => action && !action.ignore)
      .scan((acc, cur) => {
        acc.push(cur);
        return acc;
      }, [])
     .publish()
    this.historyStream.connect();
    this.historyStream.subscribe(el => this.history = el)
  }

  // Revert the app back to its original state
  clearState() {
    Object.keys(this.setOfAllActionTypes).forEach(event => {
      let action = { data: null, type: event, ignore: true }
      this.dispatch(action);
    });
  }

  timeTravelToPointN(n){
    this.clearState();
    for (let i = 0; i <= n; i++) {
      this.dispatch(Object.assign({ignore: true}, this.history[i]));
    }
  }
}

export default function createSuperstream() {
  return new Superstream();
}
