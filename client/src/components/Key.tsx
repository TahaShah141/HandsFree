import React from "react"
import { KeyType } from "../types"

export const Key: React.FC<KeyType> = ({display, keyCode, width=1}) => {
  return (
    <div style={{aspectRatio: `${width}/1`}} className="h-12 px-2 py-1 text-xs flex justify-center items-center bg-black rounded-md text-white border-[0.5px] border-white/50">
      {display}
    </div>
  )
}