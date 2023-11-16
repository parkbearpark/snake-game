import { useState, useCallback, useEffect } from 'react'
import { useInterval } from 'react-interval-hook'
import Modal from 'react-modal'
import { Board } from './components/Board'
import type { Position, SnakeSquare } from './types'
import './App.css'

const MAX_ROWS = 8
const MAX_COLUMNS = 8

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: 'black',
  },
}

type directionType = 'up' | 'down' | 'left' | 'right'

function App() {
  const [direction, setDirection] = useState<directionType>(
    'right'
  )
  const [snake, setSnake] = useState<SnakeSquare[]>([
    { position: { x: 0, y: 0 }, status: 'head' },
  ])
  const [applePosition, setApplePosition] = useState<Position>({
    x: Math.floor(Math.random() * MAX_COLUMNS),
    y: Math.floor(Math.random() * MAX_ROWS),
  })
  const [gameOver, setGameOver] = useState(false)

  Modal.setAppElement('#root')

  const { stop } = useInterval(
    () => {
      updateGame()
    },
    gameOver ? undefined : 500
  )

  const updateGame = useCallback(() => {
    setSnake((prSnake) => {
      const newHead = {
        ...prSnake[0],
        position: { ...prSnake[0].position },
      }
      const newBodies: SnakeSquare[] = prSnake.map((s) => ({
        status: 'body',
        position: { x: s.position.x, y: s.position.y },
      }))
      switch (direction) {
        case 'up':
          newHead.position.y -= 1
          break
        case 'down':
          newHead.position.y += 1
          break
        case 'left':
          newHead.position.x -= 1
          break
        case 'right':
          newHead.position.x += 1
          break
        default:
          break
      }

      if (
        prSnake[0].position.x === applePosition.x &&
        prSnake[0].position.y === applePosition.y
      ) {
        console.log('apple eaten')
        const newApplePosition = (): Position => {
          const x = Math.floor(Math.random() * MAX_COLUMNS)
          const y = Math.floor(Math.random() * MAX_ROWS)
          const isSnake = [newHead, ...newBodies].some(
            (s) => s.position.x === x && s.position.y === y
          )
          if (isSnake) return newApplePosition()
          return { x, y }
        }
        setApplePosition(newApplePosition())
        return [newHead, ...newBodies]
      }

      console.log('apple not eaten')
      const collided =
        newBodies.some((s, index) => {
          if (index === newBodies.length - 1) return false
          return (
            s.position.x === newHead.position.x &&
            s.position.y === newHead.position.y
          )
        }) ||
        newHead.position.x < 0 ||
        newHead.position.x >= MAX_COLUMNS ||
        newHead.position.y < 0 ||
        newHead.position.y >= MAX_ROWS

      if (collided) {
        stop()
        console.log('collided')
        setGameOver(true)
      }

      return [newHead, ...newBodies.slice(0, -1)]
    })
  }, [direction, applePosition, stop])

  const handleKey = useCallback((e: KeyboardEvent) => {
    const getDirection = (key: string, currentDirection: directionType) => {
      switch (key) {
        case 'ArrowUp':
          return 'up'
        case 'ArrowDown':
          return 'down'
        case 'ArrowLeft':
          return 'left'
        case 'ArrowRight':
          return 'right'
        default:
          return currentDirection
      }
    }

    setDirection((prDirection) => {
      const newDirection = getDirection(e.key, prDirection)
      if (
        (prDirection === 'up' && newDirection === 'down') ||
        (prDirection === 'down' && newDirection === 'up') ||
        (prDirection === 'left' && newDirection === 'right') ||
        (prDirection === 'right' && newDirection === 'left')
      ) {
        return prDirection
      }
      return newDirection
    })
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKey, false)
  }, [handleKey])

  return (
    <>
      <div>
        <div>
          <span>score: {snake.length - 1}</span>
        </div>
        <Board
          snake={snake}
          applePosition={applePosition}
          maxPosition={{ y: MAX_ROWS, x: MAX_COLUMNS }}
        />
      </div>
      <Modal isOpen={gameOver} style={customStyles}>
        <p>Game Over</p>
        <p>score: {snake.length - 1}</p>
        <button onClick={() => window.location.reload()}>Restart</button>
      </Modal>
    </>
  )
}

export default App
