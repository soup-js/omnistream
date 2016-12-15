export const drag = (coordinate) => (
  { type: 'BAR_MOVE', barPosition: coordinate, _ignore: true }
)

export const stopDrag = () => {
  return { type: 'STOP_DRAG', _ignore: true }
}

export const startDrag = () => {
  return { type: 'START_DRAG', _ignore: true }
}

export const mouseLeave = () => (
  { type: 'MOUSE_LEAVE', _ignore: true }
)

export const updateView = (action) => {
  return { type: 'SELECT_ACTION', _ignore: true, action }
}


