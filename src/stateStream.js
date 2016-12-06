const Rx = require('rxjs/Rx');

// creates a state stream
export default function createStatestream(reducer, actionStream) {
  return actionStream.scan(reducer, {});
}