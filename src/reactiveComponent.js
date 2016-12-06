const Rx = require('rxjs/Rx');
import React, { Component } from 'react';

// mapStreamsToProps creates an observable stream for each action type given in "streamNames". 
// This stream emits objects that will be passed down as props to the reactive components.
const mapStreamsToProps = (filteredStreams, streamNames) => {
  return Rx.Observable.combineLatest(...filteredStreams, (...filteredStreams) => {
    return streamNames.reduce((accum, curr, idx) => {
      accum[curr] = filteredStreams[idx]
      return accum;
    }, {});
  })
}

//ReactiveComponent subscribes to a stream and re-renders when it receives new data.  
export default function (componentDefinition, ...streams) {
  class ReactiveComponent extends Component {
    constructor(props, context) {
      super();
      this.state = { childProps: {} }
      this.superstream = context.superstream;

      // Make the dispatch function accessible to be passed as a prop to child components.
      this.dispatch = this.superstream.dispatch.bind(context.superstream);
      this.dispatchSideEffect = this.superstream.dispatchSideEffect.bind(context.superstream);
    }

    componentDidMount() {
      // Creates a new substream for each action type based on the provided "streamNames"
      const filteredStreams = streams.map(actionType => this.superstream.filterForActionTypes(actionType).startWith(null));
      const prop$ = mapStreamsToProps(filteredStreams, streams)
      // Subscribes to the props stream. This will trigger a re-render whenever a new action has been dispatched to 
      // any filtered stream passed down as props to a component.
      this.subscription = prop$.subscribe((props) => {
        this.setState({ childProps: props });
      });
    }

    componentWillUnmount() {
      this.subscription.unsubscribe();
    }

    render() {
      return React.createElement(componentDefinition,
        Object.assign(this.state.childProps, {
          dispatch: this.dispatch,
          dispatchSideEffect: this.dispatchSideEffect
        }), null);
    }
  }
  ReactiveComponent.contextTypes = { superstream: React.PropTypes.object.isRequired }
  return ReactiveComponent;
}
