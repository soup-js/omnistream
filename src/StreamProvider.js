import React, { Component } from 'react';

// wraps the root component and allows all children to access upstream
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
