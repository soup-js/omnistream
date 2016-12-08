const Rx = require('rxjs/Rx');
import React, { Component } from 'react';

// mapStreamsToProps creates an observable stream for each action type given in "streamNames". 
// This stream emits objects that will be passed down as props to the reactive components.
const combineStreamsToState = (stateStreams) => {
  return Rx.Observable.combineLatest(...stateStreams, (...stateData) => {
    return stateData.reduce((accum, curr) => {
      return Object.assign(accum, curr)
    }, {})
  })
}

//ReactiveComponent subscribes to a stream and re-renders when it receives new data.  
export default function (componentDefinition, ...stateStreamNames) {
  class ReactiveComponent extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = { childProps: {} }
      this.superstream = this.context.superstream;

      // Make the dispatch function accessible to be passed as a prop to child components.
      this.dispatch = this.superstream.dispatch.bind(context.superstream);
      this.dispatchObservableFn = this.superstream.dispatchObservableFn.bind(context.superstream);
    }

    componentDidMount() {
      // Creates a new substream for each action type based on the provided "streamNames"
      const stateStreams = stateStreamNames.map(name => this.superstream.store[name]);
      const state$ = combineStreamsToState(stateStreams);
      // Subscribes to the props stream. This will trigger a re-render whenever a new action has been dispatched to 
      // any filtered stream passed down as props to a component.
      this.subscription = state$.subscribe((props) => {
        this.setState({ childProps: Object.assign({}, this.state.childProps) });
      });
    }

    componentWillUnmount() {
      this.subscription.unsubscribe();
    }

    render() {
      return React.createElement(componentDefinition,
        Object.assign({}, this.state.childProps, {
          dispatch: this.dispatch,
          dispatchObservableFn: this.dispatchObservableFn,
          superstream: this.superstream
        }, this.props), null);
    }
  }
  ReactiveComponent.contextTypes = { superstream: React.PropTypes.object.isRequired }
  return ReactiveComponent;
}
