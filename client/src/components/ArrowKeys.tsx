import { useEffect, useState } from 'react'

import { CanClick } from '../types'
import down from '../assets/down.svg'
import left from '../assets/left.svg'
import right from '../assets/right.svg'
import up from '../assets/up.svg'

export const ArrowKeys: React.FC<CanClick> = ({onClick}) => {

  const [lastTapped, setLastTapped] = useState("")
  useEffect(() => {
    if (lastTapped)
      setTimeout(() => setLastTapped(""), 200)
  }, [lastTapped])

  return (
    <div className="flex flex-1 gap-1 items-end">
      <div onClick={() => {setLastTapped("left"); onClick({keyCode: 'left', display: <img className="size-1.5" src={left} />})}} style={{aspectRatio: `2 / 1`}} className={`h-1/2 px-2 py-1 border-[0.5px] ${lastTapped === 'left' ? "border-white" : "border-white/50"} text-xs flex justify-center items-center bg-black rounded-md text-white`}>
        <img className="size-1.5" src={left} />
      </div>  

      <div className="flex flex-col flex-1 gap-px h-full">
        <div onClick={() => {setLastTapped("up"); onClick({keyCode: 'up', display: <img className="size-1.5" src={left} />})}} className={`flex-1 w-full px-2 py-1 border-[0.5px] ${lastTapped === 'up' ? "border-white" : "border-white/50"} text-xs flex justify-center items-center bg-black rounded-t-md text-white`}>
          <img className="size-1.5" src={up} />
        </div>
        <div onClick={() => {setLastTapped("down"); onClick({keyCode: 'down', display: <img className="size-1.5" src={left} />})}} className={`flex-1 w-full px-2 py-1 border-[0.5px] ${lastTapped === 'down' ? "border-white" : "border-white/50"} text-xs flex justify-center items-center bg-black rounded-b-md text-white`}>
          <img className="size-1.5" src={down} />
        </div>
      </div>

      <div onClick={() => {setLastTapped("right"); onClick({keyCode: 'right', display: <img className="size-1.5" src={left} />})}} style={{aspectRatio: `2 / 1`}} className={`h-1/2 px-2 py-1 border-[0.5px] ${lastTapped === 'right' ? "border-white" : "border-white/50"} text-xs flex justify-center items-center bg-black rounded-md text-white`}>
        <img className="size-1.5" src={right} />
      </div>  
    </div>
  )
}