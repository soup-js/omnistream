function dragReducer(state = { dragging: false }, action) {
  console.log('dragreducer', action);
  switch (action.type) {
    case 'STOP_DRAG':
      return Object.assign({}, state, { dragging: false })
    case 'START_DRAG':
      return Object.assign({}, state, { dragging: true })
    case 'SELECT_ACTION':
      return Object.assign({}, state, {action: action.action});
  }
  return state;
}

function barPositionReducer(state = { barPosition: 10 }, action) {
  switch (action.type) {
    case 'BAR_MOVE':
      return Object.assign({}, state, { barPosition: action.barPosition })
  }
  return state;
}


export { barPositionReducer, dragReducer };