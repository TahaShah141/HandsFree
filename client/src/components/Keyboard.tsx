import { useState } from "react"
import { KEYS } from "../KEYS"
import { ArrowKeys } from "./ArrowKeys"
import { Key } from "./Key"

export const Keyboard = () => {

  const [keySequence, setKeySequence] = useState("")

  const handleClick = (s: string) => {
    setKeySequence(s)
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="p-1 w-fit flex flex-col gap-1 rounded-md bg-slate-800">
        {KEYS.map((row, i) => (
          <div className="flex gap-1">
            {row.map(k => <Key {...k} onClick={handleClick} />)}
            {i === KEYS.length - 1 && <ArrowKeys onClick={handleClick} />}
          </div>
        ))}
      </div>
      <p>{keySequence}</p>
    </div>
  )
}