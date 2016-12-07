function reducer(state = { barPosition: 10, dragging: false }, action) {
  switch (action.type) {
    case 'BAR_MOVE':
      return Object.assign({}, state, { barPosition: action.barPosition })
    case 'STOP_DRAG': 
      return Object.assign({}, state, { dragging: false})
    case 'START_DRAG':
      return Object.assign({}, state, { dragging: false})
  }
}