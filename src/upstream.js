const Rx = require('rxjs/Rx');

class Upstream {
  // instatiates a new, singular stream to hold state for the application
  constructor() {
    this.stream = new Rx.BehaviorSubject();
  // allows for time travel debugging
    this.history = [];
    this.eventTypes = {};

  // creates the history stream and the record action type stream
    this.getHistory();
    this.recordActionTypes();
  }

  // Checks whether each action dispatched has data and type properties. If so, passes the action to the stream
  dispatch(data) {
    if (!(data.hasOwnProperty('data') && data.hasOwnProperty('type'))) {
      throw new Error('Actions dispatched upstream must be objects with data and type properties')
    }
    this.stream.next(data);
  }

  dispatchSideEffect(streamFunction) {
    const sideEffectStream = streamFunction(this.stream.filter(action => action).skip(1));
    sideEffectStream.subscribe((action) => {
      this.dispatch(action);
    })
  }

  // storing a reference to every action type that passes through the stream to clear the history by setting all actions to undefined
   recordActionTypes() {
    this.actionStream = this.stream.filter(action => action).map(action => action.type)
    this.actionStream.subscribe(type => this.eventTypes[type] = true);
  }

  // used to separate actions by type into substreams
  filterForAction(actionType) {
    return this.stream.filter(action => {
      return action ? (action.type === actionType) : action
    })
      .map(action => action ? action.data : action)
  }

  // collecting an array of all actions that pass through the stream excluding null actions and repeated actions revisited during time travel
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

  // reverts the app back to its original state
  clearState() {
    Object.keys(this.eventTypes).forEach(event => {
      let action = { data: null, type: event, ignore: true }
      this.dispatch(action);
    });

  }

  // allows the user to return to a specific point in time
  timeTravelToPointN(n){
    this.clearState();
    for (let i = 0; i <= n; i++) {
      this.dispatch(Object.assign({ignore: true}, this.history[i]));
    }
  }
}


export default function createUpstream() {
  return new Upstream();
}
