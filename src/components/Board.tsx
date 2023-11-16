import { FC, useMemo } from 'react'
import Square from './Square'
import type { SnakeSquare, Position } from '../types'

type Props = {
  snake: SnakeSquare[]
  maxPosition: Position
  applePosition: Position
}

const Board: FC<Props> = ({ maxPosition, snake, applePosition }) => {
  const getSquare = useMemo(
    () => (x: number, y: number) => {
      const snakeFilter = snake.filter(
        (s) => s.position.x === x && s.position.y === y
      )
      if (snakeFilter.length !== 0) {
        return <Square squareStatus={snakeFilter[0].status} key={x} />
      }
      if (applePosition.x === x && applePosition.y === y) {
        return <Square squareStatus="apple" key={x} />
      }
      return <Square squareStatus="empty" key={y * 10 + x} />
    },
    [snake, applePosition]
  )

  return (
    <div className="board">
      {[...Array(maxPosition.y)].map((_, i) => (
        <div className="board-row" key={i}>
          {[...Array(maxPosition.x)].map((_, j) => ({ ...getSquare(j, i) }))}
        </div>
      ))}
    </div>
  )
}

export { Board }
