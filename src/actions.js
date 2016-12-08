export const drag = (coordinate) => (
  { type: 'BAR_MOVE', barPosition: coordinate, _ignore: true }
)

export const stopDrag = () => (
  { type: 'STOP_DRAG', _ignore: true }
)

export const startDrag = () => (
  { type: 'START_DRAG', _ignore: true }
)