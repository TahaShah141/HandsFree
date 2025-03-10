import { CanClick, KeyType } from "../types"
import { useEffect, useState } from "react"

export const Key: React.FC<KeyType & CanClick> = ({display, keyCode, pressed=false, width=1, onClick}) => {

  const [tapped, setTapped] = useState(false)
  useEffect(() => {
    if (tapped)
      setTimeout(() => setTapped(false), 200)
  }, [tapped])

  return (
    <div onClick={() => {setTapped(true); onClick({keyCode, display})}} style={{aspectRatio: `${width}/1`}} className={`h-12 px-2 py-1 text-xs flex justify-center items-center bg-black rounded-md text-white ${pressed || tapped ? "border-white" : "border-white/50"} border-[0.5px]`}>
      {display}
    </div>
  )
}