const Rx = require('rxjs/Rx');
import React, { Component } from 'react';

// creates an observable stream for each action type that will emit objects that will be passed down as props
const mapStreamsToProps = (filteredStreams, streamNames) => {
  return Rx.Observable.combineLatest(...filteredStreams, (...filteredStreams) => {
    return streamNames.reduce((accum, curr, idx) => {
      accum[curr] = filteredStreams[idx]
      return accum;
    }, {});
  })
}

// exports function to create new components that builds upon the native React component class
export default function (componentDefinition, ...streams) {
  console.log('reactive component');
  class ReactiveComponent extends Component {
    constructor(props, context) {
      super();
      this.state = { childProps: {} }
      this.upstream = context.upstream;

      // make dispatch and upstream accessible to all components
      this.dispatch = this.upstream.dispatch.bind(context.upstream);
      
      // make dispatch side effect accessible to all components
      this.dispatchSideEffect = this.upstream.dispatchSideEffect.bind(context.upstream);
    }

    componentDidMount() {
      console.log('mounted');
      // creates a new substream for each action type
      const filteredStreams = streams.map(actionType => this.upstream.filterForAction(actionType).startWith(null));
      const component$ = mapStreamsToProps(filteredStreams, streams)
      // subscribes to the props stream. This will trigger a rerender whenever a new action has been dispatched to any filtered stream passed down as props to a component
      this.subscription = component$.subscribe((props) => {
        this.setState({ childProps: props });
      });
    }

    componentWillUnmount() {
      this.subscription.unsubscribe();
    }

    render() {
      const dispatch = this.dispatch;
      const dispatchSideEffect = this.dispatchSideEffect;
      console.log('childProps', this.state.childProps);
      console.log('rendering', Object.assign(this.state.childProps, { dispatch, dispatchSideEffect}))
      return React.createElement(componentDefinition,
        Object.assign(this.state.childProps, { dispatch, dispatchSideEffect}),
      null);
    }
  }
ReactiveComponent.contextTypes = { upstream: React.PropTypes.object.isRequired }
return ReactiveComponent;
}
