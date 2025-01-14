import React from "react"
import { CanClick, KeyType } from "../types"

export const Key: React.FC<KeyType & CanClick> = ({display, keyCode, width=1, onClick}) => {
  return (
    <div onClick={() => onClick(keyCode)} style={{aspectRatio: `${width}/1`}} className="h-12 px-2 py-1 text-xs flex justify-center items-center bg-black rounded-md text-white border-[0.5px] border-white/50">
      {display}
    </div>
  )
}