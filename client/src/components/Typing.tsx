import { useState } from "react";

type TypingProps = {
  prevState: () => void;
}


export const Typing = ({prevState}: TypingProps) => {
  const [text, setText] = useState("")

  const cancelText = () => {
    prevState()
    setText("")
  }
  
  const sendText = () => {
    fetch(`http://${window.location.hostname}:1301/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
      }),
    })
    prevState()
    setText("")
  }
  return (
    <div className="flex flex-col h-screen gap-2">
      <div className="flex justify-between items-center gap-2">
          <button className="size-8" onClick={cancelText}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"/></svg>
          </button>
          <h2 className="text-2xl">Send Text</h2>
        <button className="size-8" onClick={sendText}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20.33 3.67a1.45 1.45 0 0 0-1.47-.35L4.23 8.2A1.44 1.44 0 0 0 4 10.85l6.07 3l3 6.09a1.44 1.44 0 0 0 1.29.79h.1a1.43 1.43 0 0 0 1.26-1l4.95-14.59a1.41 1.41 0 0 0-.34-1.47M4.85 9.58l12.77-4.26l-7.09 7.09Zm9.58 9.57l-2.84-5.68l7.09-7.09Z"/></svg>
        </button>
      </div>
      <textarea className="text-3xl p-2 text-white font-mono focus:outline-none bg-black flex-1" placeholder="Type Here..." value={text} onChange={(e) => setText(e.target.value)} autoFocus />
    </div>
  )
}
