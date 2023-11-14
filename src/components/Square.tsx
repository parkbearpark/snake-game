import { type FC, useCallback } from 'react'

const STATUS_TABLE = {
  apple: 'red',
  body: 'green',
  head: 'blue',
  empty: 'black',
} as const

type SquareStatuses = keyof typeof STATUS_TABLE
type SquareColors = (typeof STATUS_TABLE)[SquareStatuses]
type Props = {
  squareStatus: SquareStatuses
}

const Square: FC<Props> = ({ squareStatus }) => {
  const squareColor = useCallback((s: SquareStatuses): SquareColors => {
    return STATUS_TABLE[s]
  }, [])

  return (
    <div
      className="square"
      style={{ backgroundColor: squareColor(squareStatus) }}
    ></div>
  )
}

export { Square, type SquareStatuses, type SquareColors }
