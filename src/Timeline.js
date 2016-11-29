import React, { Component } from 'react';

class Timeline extends Component {
  constructor(props) {
    super();
    this.historyStream = props.upstream.historyStream;
    this.state = { history: [] }
    this.timeTravelToPointN = props.upstream.timeTravelToPointN.bind(props.upstream);
  }

  componentDidMount() {
    this.historyStream.subscribe((historyArray) => {
      this.setState({ history: historyArray});
    })
  }

  render() {
    return (
    <div>
      {this.state.history.map((node, index) => {
        return <button className='timeline-button' key={index} 
          onClick={() => this.timeTravelToPointN(index)}> {index} </button>
       })}
    </div>
    )
  }
}


export default Timeline;