const Rx = require('rxjs/Rx');
import React, { PureComponent } from 'react';

// mapStreamsToProps creates an observable stream for each action type given in "streamNames". 
// This stream emits objects that will be passed down as props to the reactive components.
const combineStreamsToState = (stateStreams) => {
  return Rx.Observable.combineLatest(...stateStreams, (...stateData) => {
    return stateData.reduce((accum, curr) => {
      return Object.assign(accum, curr)
    }, {})
  }).distinctUntilChanged(null, state => JSON.stringify(state));
}

//ReactiveComponent subscribes to a stream and re-renders when it receives new data.  
function makeReactive(componentDefinition, renderFn, ...stateStreamNames) {
  class ReactiveComponent extends PureComponent {
    constructor(props, context) {
      super(props, context);
      this.state = { childProps: {} }
      this.omnistream = this.context.omnistream;

      // Make the dispatch function accessible to be passed as a prop to child components.
      this.dispatch = this.omnistream.dispatch.bind(context.omnistream);
      this.dispatchObservableFn = this.omnistream.dispatchObservableFn.bind(context.omnistream);
    }

    componentDidMount() {
      // Creates a new substream for each action type based on the provided "streamNames"
      const stateStreams = stateStreamNames.map(name => this.omnistream.store[name]);
      const state$ = combineStreamsToState(stateStreams);
      // Subscribes to the props stream. This will trigger a re-render whenever a new action has been dispatched to 
      // any filtered stream passed down as props to a component.
      this.subscription = state$.subscribe((props) => {
        this.setState({ childProps: Object.assign({}, this.props, props) });
      });
    }

    componentWillUnmount() {
      this.subscription.unsubscribe();
    }

    render() {
      return renderFn.call(this, componentDefinition);
    }
  }
  ReactiveComponent.contextTypes = { omnistream: React.PropTypes.object.isRequired }
  return ReactiveComponent;
}

function renderTimeline(componentDefinition) {
  return React.createElement(componentDefinition,
    Object.assign({}, this.state.childProps, {
      dispatch: this.dispatch,
      dispatchObservableFn: this.dispatchObservableFn,
      omnistream: this.omnistream
    }, this.props), null)
}

function renderStandard(componentDefinition) {
  return React.createElement(componentDefinition,
    Object.assign({}, this.state.childProps, {
      dispatch: this.dispatch,
      dispatchObservableFn: this.dispatchObservableFn,
    }, this.props), null)
}

export const reactiveComponent = (componentDefinition, ...stateStreamNames) =>
  makeReactive(componentDefinition, renderStandard, ...stateStreamNames)

export const reactiveTimeline = (componentDefinition, ...stateStreamNames) =>
  makeReactive(componentDefinition, renderTimeline, ...stateStreamNames)