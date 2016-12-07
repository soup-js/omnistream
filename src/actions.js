export default dragMovement = (coordinate) => (
  { type: 'BAR_MOVE', barPosition: coordinate }
)

export default stopDragging = () => (
  { type: 'STOP_DRAG' }
)

export default startDragging = () => (
  { type: 'STOP_DRAG' }
)