import { AddTappingKeyOptionsType, TapKeyType } from "../types"

import { TapKey } from "./TapKey"
import { useState } from "react"

type TappingProps = {
  changeState: (s: string) => void
  tappingKeys: TapKeyType
  setSelectingKey: (bool: boolean) => void
  setAddTapKeyOptions: (options: AddTappingKeyOptionsType) => void
  isArrowKeys: boolean
  setIsArrowKeys: (b: boolean) => void
}


export const Tapping = ({ changeState, tappingKeys, setAddTapKeyOptions, setSelectingKey, isArrowKeys, setIsArrowKeys }: TappingProps) => {

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
      {isArrowKeys ? 
      <div className="size-full bg-neutral-950 rounded-xl flex flex-col gap-2 justify-center items-center" onClick={(e) => {e.stopPropagation(); setIsArrowKeys(false)}}>
        <svg className="size-10 rotate-45 p-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 14q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m-5.6 5H8q.425 0 .713.288T9 20t-.288.713T8 21H4q-.425 0-.712-.288T3 20v-4q0-.425.288-.712T4 15t.713.288T5 16v1.6l2.4-2.4q.275-.275.7-.275t.7.275t.275.7t-.275.7zm11.2 0l-2.4-2.4q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l2.4 2.4V16q0-.425.288-.712T20 15t.713.288T21 16v4q0 .425-.288.713T20 21h-4q-.425 0-.712-.288T15 20t.288-.712T16 19zM5 6.4V8q0 .425-.288.713T4 9t-.712-.288T3 8V4q0-.425.288-.712T4 3h4q.425 0 .713.288T9 4t-.288.713T8 5H6.4l2.4 2.4q.275.275.275.7t-.275.7t-.7.275t-.7-.275zm14 0l-2.4 2.4q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7L17.6 5H16q-.425 0-.712-.287T15 4t.288-.712T16 3h4q.425 0 .713.288T21 4v4q0 .425-.288.713T20 9t-.712-.288T19 8z"/></svg>        
      </div>:
      <>
      <TapKey position={[]} keys={tappingKeys} isVertical={true} onClick={tapKey} />
      <div className="absolute bottom-2 -right-2 flex gap-2 items-center justify-between">
        <button className={`rounded-md ${isArrowKeys ? "text-neutral-600 bg-white" : "bg-neutral-600"}`} onClick={(e) => {e.stopPropagation(); setIsArrowKeys(true)}}>
          <svg className="size-10 rotate-45 p-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 14q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m-5.6 5H8q.425 0 .713.288T9 20t-.288.713T8 21H4q-.425 0-.712-.288T3 20v-4q0-.425.288-.712T4 15t.713.288T5 16v1.6l2.4-2.4q.275-.275.7-.275t.7.275t.275.7t-.275.7zm11.2 0l-2.4-2.4q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l2.4 2.4V16q0-.425.288-.712T20 15t.713.288T21 16v4q0 .425-.288.713T20 21h-4q-.425 0-.712-.288T15 20t.288-.712T16 19zM5 6.4V8q0 .425-.288.713T4 9t-.712-.288T3 8V4q0-.425.288-.712T4 3h4q.425 0 .713.288T9 4t-.288.713T8 5H6.4l2.4 2.4q.275.275.275.7t-.275.7t-.7.275t-.7-.275zm14 0l-2.4 2.4q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7L17.6 5H16q-.425 0-.712-.287T15 4t.288-.712T16 3h4q.425 0 .713.288T21 4v4q0 .425-.288.713T20 9t-.712-.288T19 8z"/></svg>
          {/* <svg className="size-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M13 11h5l-1.5-1.5l1.42-1.42L21.84 12l-3.92 3.92l-1.42-1.42L18 13h-5v5l1.5-1.5l1.42 1.42L12 21.84l-3.92-3.92L9.5 16.5L11 18v-5H6l1.5 1.5l-1.42 1.42L2.16 12l3.92-3.92L7.5 9.5L6 11h5V6L9.5 7.5L8.08 6.08L12 2.16l3.92 3.92L14.5 7.5L13 6z"/></svg> */}
        </button>
        <button className={`rounded-md ${editState === "ADD" ? "text-neutral-600 bg-white" : "bg-neutral-600"}`} onClick={(e) => {e.stopPropagation(); editState === "ADD" ? setEditState("") : setEditState("ADD")}}>
          <svg className="size-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/></svg>
        </button>
        <button className={`rounded-md ${editState === "SPLIT" ? "text-neutral-600 bg-white" : "bg-neutral-600"}`} onClick={(e) => {e.stopPropagation(); editState === "SPLIT" ? setEditState("") : setEditState("SPLIT")}}>
          <svg className="size-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m14 4l2.29 2.29l-2.88 2.88l1.42 1.42l2.88-2.88L20 10V4M10 4H4v6l2.29-2.29l4.71 4.7V20h2v-8.41l-5.29-5.3"/></svg>
        </button>
        <button className={`rounded-md ${editState === "DELETE" ? "text-neutral-600 bg-white" : "bg-neutral-600"}`} onClick={(e) => {e.stopPropagation(); editState === "DELETE" ? setEditState("") : setEditState("DELETE")}}>
          <svg className="size-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3zM7 6h10v13H7zm2 2v9h2V8zm4 0v9h2V8z"/></svg>
        </button>
      </div>
      </>}
    </div>
  )
}
