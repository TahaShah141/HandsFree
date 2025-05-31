import './App.css'

import { Direction } from './types'
import { Keyboard } from './components/Keyboard'
import SwipeArea from './components/SwipeArea'
import { useState } from 'react'

function App() {

  const sendScrollRequest = (direction: Direction, magnitude: number, isArrowKeys: boolean) => {
    if (magnitude == 0) return;
    fetch(`http://${window.location.hostname}:1301/scroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        direction,
        magnitude,
        isArrowKeys
      }),
    })
  }

  const [isSwiping, setIsSwiping] = useState(true)
  const [isArrowKeys, setIsArrowKeys] = useState(false)
  
  const onSwipeUp = (scrollAmount: number) => sendScrollRequest("down", scrollAmount, isArrowKeys)
  const onSwipeDown = (scrollAmount: number) => sendScrollRequest("up", scrollAmount, isArrowKeys)
  const onSwipeRight = (scrollAmount: number) => sendScrollRequest("right", scrollAmount, isArrowKeys)
  const onSwipeLeft = (scrollAmount: number) => sendScrollRequest("left", scrollAmount, isArrowKeys)

  return (
    <SwipeArea isSwiping={isSwiping} onSwipeDown={onSwipeDown} onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight} onSwipeUp={onSwipeUp}>
      <>
      <div className='landscape:hidden h-screen flex flex-col justify-center items-center'>
        <Keyboard setIsArrowKeys={setIsArrowKeys} setIsSwiping={setIsSwiping} isSwiping={isSwiping}/>
      </div>
      <div className='p-4 hidden flex-col landscape:flex justify-center items-center h-screen'>
        <Keyboard setIsArrowKeys={setIsArrowKeys} setIsSwiping={setIsSwiping} isSwiping={isSwiping}/>
      </div>
      </>
    </SwipeArea>
  )
}

export default App
