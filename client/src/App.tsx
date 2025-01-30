import { useState } from 'react'
import './App.css'
import { Keyboard } from './components/Keyboard'
import SwipeArea from './components/SwipeArea'
import { Direction } from './types'

function App() {

  const [_swiped, setSwiped] = useState("None")

  const sendScrollRequest = (direction: Direction, magnitude: number) => {
    setSwiped(`${direction} ${magnitude}`)
    fetch(`http://${window.location.hostname}:1301/scroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        direction,
        magnitude
      }),
    })
  }

  const onSwipeUp = (scrollAmount: number) => sendScrollRequest("down", scrollAmount)
  const onSwipeDown = (scrollAmount: number) => sendScrollRequest("up", scrollAmount)
  const onSwipeRight = (scrollAmount: number) => sendScrollRequest("right", scrollAmount)
  const onSwipeLeft = (scrollAmount: number) => sendScrollRequest("left", scrollAmount)

  const [isSwiping, setIsSwiping] = useState(true)

  return (
    <SwipeArea isSwiping={isSwiping} onSwipeDown={onSwipeDown} onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} onSwipeUp={onSwipeUp}>
      <>
      <div className='landscape:hidden h-screen flex flex-col justify-center items-center'>
        <Keyboard setIsSwiping={setIsSwiping}/>
      </div>
      <div className='p-4 hidden flex-col landscape:flex justify-center items-center h-screen'>
        <Keyboard setIsSwiping={setIsSwiping}/>
      </div>
      </>
    </SwipeArea>
  )
}

export default App
