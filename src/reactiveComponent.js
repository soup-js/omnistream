const Rx = require('rxjs/Rx');
import React, { Component } from 'react';

const mapStreamsToProps = (filteredStreams, streamNames) => {
  return Rx.Observable.combineLatest(...filteredStreams, (...filteredStreams) => {
    return streamNames.reduce((accum, curr, idx) => {
      accum[curr] = filteredStreams[idx]
      return accum;
    }, {});
  })
}

export default function (componentDefinition, ...streams) {
  return class extends Component {
    state = { childProps: {} }
    static contextTypes = { upstream: React.PropTypes.object.isRequired }

    componentWillMount() {
      this.dispatch = this.context.upstream.dispatch.bind(this.context.upstream);
      const upstream = this.context.upstream;
      const filteredStreams = streams.map(actionType => upstream.filterForAction(actionType).startWith(null));
      const component$ = mapStreamsToProps(filteredStreams, streams)
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
