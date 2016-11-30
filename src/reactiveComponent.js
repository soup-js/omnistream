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
  return class extends Component {
    // do we need this?
    state = { childProps: {} }
    static contextTypes = { upstream: React.PropTypes.object.isRequired }

    //
    componentDidMount() {
    // make dispatch and upstream accessible to all components
      this.dispatch = this.context.upstream.dispatch.bind(this.context.upstream);
      const upstream = this.context.upstream;
    // creates a new substream for each action type
      const filteredStreams = streams.map(actionType => upstream.filterForAction(actionType).startWith(null));
      const component$ = mapStreamsToProps(filteredStreams, streams)
    // subscribes to the props stream. This will trigger a rerender whenever a new action has been dispatched to any filtered stream passed down as props to a component
      this.subscription = component$.subscribe((props) => {
        this.setState({ childProps: props});
      });
    }

    componentWillUnmount() {
      this.subscription.unsubscribe();
    }

    render() {
      return React.createElement(componentDefinition,
      Object.assign(this.state.childProps, {dispatch: this.dispatch}),
      null);
    }
  }
}
