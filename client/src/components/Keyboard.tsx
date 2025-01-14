import { KEYS } from "../KEYS"
import { ArrowKeys } from "./ArrowKeys"
import { Key } from "./Key"

export const Keyboard = () => {
  return (
    <div className="p-1 w-fit flex flex-col gap-1 rounded-md bg-slate-950">
      {KEYS.map((row, i) => (
        <div className="flex gap-1">
          {row.map(k => <Key {...k} />)}
          {i === KEYS.length - 1 && <ArrowKeys />}
        </div>
      ))}
    </div>
  )
}