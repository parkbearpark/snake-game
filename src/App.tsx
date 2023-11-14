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

function App() {
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('right')
  const [snake, setSnake] = useState<SnakeSquare[]>([{ position: {x: 0, y: 0}, status: 'head' }])
  const [applePosition, setApplePosition] = useState<Position>({
    x: Math.floor(Math.random() * MAX_COLUMNS),
    y: Math.floor(Math.random() * MAX_ROWS),
  })
  const [gameOver, setGameOver] = useState(false)

  Modal.setAppElement('#root')

  const { stop } = useInterval(() => {
    updateGame()
  }, gameOver ? undefined : 500)

  const updateGame = useCallback(() => {
    setSnake((prSnake) => {
      const newHead = {
        ...prSnake[0],
        position: { ...prSnake[0].position }
      }
      const newBodies: SnakeSquare[] = prSnake.map((s) => ({ status: 'body', position: { x: s.position.x, y: s.position.y } }))
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

      if (prSnake[0].position.x === applePosition.x && prSnake[0].position.y === applePosition.y) {
        console.log('apple eaten')
        setApplePosition({
          x: Math.floor(Math.random() * MAX_COLUMNS),
          y: Math.floor(Math.random() * MAX_ROWS),
        })
        return [newHead, ...newBodies]
      }

      console.log('apple not eaten')
      console.log(newHead.position.x < 0)
      const collided = newBodies.some((s, index) => {
        if (index === newBodies.length - 1) return false
        return (s.position.x === newHead.position.x && s.position.y === newHead.position.y)
      })
        || (newHead.position.x < 0 || newHead.position.x >= MAX_COLUMNS)
        || newHead.position.y < 0 || newHead.position.y >= MAX_ROWS

      if (collided) {
        stop()
        console.log('collided')
        setGameOver(true)
      }

      return [newHead, ...newBodies.slice(0, -1)]
    })
  }, [direction, applePosition, stop])


  const handleKey = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        setDirection('up')
        break
      case 'ArrowDown':
        setDirection('down')
        break
      case 'ArrowLeft':
        setDirection('left')
        break
      case 'ArrowRight':
        setDirection('right')
        break
      default:
        break
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKey, false);
  }, [handleKey]);

  return (
    <>
      <div>
        <div>
          <span>score: {snake.length - 1}</span>
        </div>
        {/* <input
          type="text"
          onKeyDown={handleKey}
          // style={{ background: 'transparent', border: 'none !important', fontSize: 0 }}
          autoFocus
          tabIndex={-1}
        /> */}
        <Board snake={snake} applePosition={applePosition} maxPosition={{y: MAX_ROWS, x: MAX_COLUMNS}}/>
      </div>
      <Modal
        isOpen={gameOver}
        style={customStyles}
      >
        <p>Game Over</p>
        <p>score: {snake.length - 1}</p>
        <button onClick={() => window.location.reload()}>Restart</button>
      </Modal>
    </>
  )
}

export default App
