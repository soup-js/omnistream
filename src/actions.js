export const drag = (coordinate) => (
  { type: 'BAR_MOVE', barPosition: coordinate, _ignore: true }
)

export const stopDrag = () => {
  console.log('stop drag called');
  return { type: 'STOP_DRAG', _ignore: true }
}

export const startDrag = () => {
  console.log('startDrag called');
  return { type: 'START_DRAG', _ignore: true }
}

export const mouseLeave = () => (
  { type: 'MOUSE_LEAVE', _ignore: true }
)

