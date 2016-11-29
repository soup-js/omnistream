import React, { Component } from 'react';

export class StreamProvider extends Component {
  getChildContext() {
    return { upstream: this.props.upstream }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

export default StreamProvider;

StreamProvider.childContextTypes = {
  upstream: React.PropTypes.object.isRequired
}

