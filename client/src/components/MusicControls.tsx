"use client"

import { pressKey } from "../lib/hooks/useKeyboard"
import { useState } from "react"

type MusicControlsProps = {
  className?: string
  iconClassName?: string
}

export const MusicControls = ({ className="", iconClassName }: MusicControlsProps) => {

  const [paused, setPaused] = useState(false)
  const onPrevClick = () => {
    pressKey("f7");
    setPaused(false)
  }
  const onPauseClick = () => {
    pressKey("f8");
    setPaused(!paused)
  }
  const onNextClick = () => {
    pressKey("f9");
    setPaused(false)
  }

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <button onClick={onPrevClick}>
        <svg className={iconClassName} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M5.5 17V7q0-.425.288-.712T6.5 6t.713.288T7.5 7v10q0 .425-.288.713T6.5 18t-.712-.288T5.5 17m11.45-.025l-6.2-4.15q-.225-.15-.337-.362T10.3 12t.113-.462t.337-.363l6.2-4.15q.125-.1.275-.125t.275-.025q.4 0 .7.275t.3.725v8.25q0 .45-.3.725t-.7.275q-.125 0-.275-.025t-.275-.125"/></svg>
      </button>
      <button onClick={onPauseClick}>
        {paused ?
          <svg className={iconClassName} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712"/></svg>
          :
          <svg className={iconClassName} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M16 19q-.825 0-1.412-.587T14 17V7q0-.825.588-1.412T16 5t1.413.588T18 7v10q0 .825-.587 1.413T16 19m-8 0q-.825 0-1.412-.587T6 17V7q0-.825.588-1.412T8 5t1.413.588T10 7v10q0 .825-.587 1.413T8 19"/></svg>
        }
      </button>
      <button onClick={onNextClick}>
        <svg className={iconClassName} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M16.5 17V7q0-.425.288-.712T17.5 6t.713.288T18.5 7v10q0 .425-.288.713T17.5 18t-.712-.288T16.5 17m-11-.875v-8.25q0-.45.3-.725t.7-.275q.125 0 .275.025t.275.125l6.2 4.15q.225.15.338.363T13.7 12t-.112.463t-.338.362l-6.2 4.15q-.125.1-.275.125t-.275.025q-.4 0-.7-.275t-.3-.725"/></svg>
      </button>
    </div>
  )
}
