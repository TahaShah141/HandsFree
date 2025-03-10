import { AddTappingKeyOptionsType, TapKeyType } from "../types"

import { TapKey } from "./TapKey"
import { useState } from "react"

type TappingProps = {
  changeState: (s: string) => void
  tappingKeys: TapKeyType
  setSelectingKey: (bool: boolean) => void
  setAddTapKeyOptions: (options: AddTappingKeyOptionsType) => void
}


export const Tapping = ({ changeState, tappingKeys, setAddTapKeyOptions, setSelectingKey }: TappingProps) => {

  const tapKey = (keycode: string, position: number[]) => {
    if (editState) {
      setAddTapKeyOptions({
        type: editState,
        index: position[position.length-1],
        position: position.slice(0, -1)
      })
      setSelectingKey(true)
      return
    }

    fetch(`http://${window.location.hostname}:1301/keyboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keys: [keycode],
      }),
    })
  }

  const [editState, setEditState] = useState<"ADD" | "DELETE" | "SPLIT" | "">("")

  return (
    <div onClick={() => changeState("KEYBOARD")} className="size-full relative py-8">
      <TapKey position={[]} keys={tappingKeys} isVertical={true} onClick={tapKey} />
      <div className="absolute bottom-2 -right-2 flex gap-2 items-center justify-center">
        <button className="rounded-md bg-neutral-600" onClick={(e) => {e.stopPropagation(); setEditState("ADD")}}>
          <svg className="size-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>
        </button>
        <button className="rounded-md bg-neutral-600" onClick={(e) => {e.stopPropagation(); setEditState("SPLIT")}}>
          <svg className="size-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m14 4l2.29 2.29l-2.88 2.88l1.42 1.42l2.88-2.88L20 10V4M10 4H4v6l2.29-2.29l4.71 4.7V20h2v-8.41l-5.29-5.3"/></svg>
        </button>
        <button className="rounded-md bg-neutral-600" onClick={(e) => {e.stopPropagation(); setEditState("DELETE")}}>
          <svg className="size-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zM7 6h10v13H7zm2 2v9h2V8zm4 0v9h2V8z"/></svg>
        </button>
      </div>
    </div>
  )
}
