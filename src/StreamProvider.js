import React, { Component } from 'react';

// Wrap the root component and allow all children to access superstream through context.
class StreamProvider extends Component {
  getChildContext() {
    return { omnistream: this.props.omnistream }
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
  superstream: React.PropTypes.object.isRequired
}
