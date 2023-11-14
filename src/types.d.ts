export interface SnakeSquare {
  position: Position
  status: 'body' | 'head'
  parent?: SnakeSquare
}

export interface Position {
  x: number
  y: number
}

