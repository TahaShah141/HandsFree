import { useEffect, useState } from "react"
import { KEYS as DefaultKEYS } from "../KEYS"
import { ArrowKeys } from "./ArrowKeys"
import { Key } from "./Key"

const modifiers = ['hyper', 'ctrl', 'fn', 'alt', 'cmd', 'shift']

type KeyboardProps = {
  log?: string
  setIsSwiping?: (b: boolean) => void
}

export const Keyboard = ({log="", setIsSwiping=()=>{}}: KeyboardProps) => {

  const [flipped, setFlipped] = useState(false)
  const [fnPressed, setFnPressed] = useState(false)
  const [hyperPressed, setHyperPressed] = useState(false)
  const [KEYS, setKEYS] = useState(DefaultKEYS)
  const [modifiersPressed, setModifiersPressed] = useState<string[]>([])
  const [typing, setTyping] = useState(false)
  const [text, setText] = useState("")

  const handleClick = (s: string) => {

    if (fnPressed && modifiersPressed.length === 0) {
      if (s === 'space') {
        setTyping(true)
      }
      if (s === '/') {
        setFlipped(!flipped)
      }
      setFnPressed(false)
      setKEYS(DefaultKEYS)
      return;
    }

    //use power key
    if (s === 'lock') {

      if (hyperPressed) {
        fetch(`http://${window.location.hostname}:1301/kill`)
        setTimeout(() => window.location.reload(), 500)
        return
      }

      console.log("locking")
      fetch(`http://${window.location.hostname}:1301/keyboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keys: ['ctrl', 'alt', 'cmd', 'shift', 'escape'],
        }),
      })
      if (!fnPressed) {
        setKEYS(DefaultKEYS)
        setHyperPressed(false)
        setModifiersPressed([])
      }
      return;
    }

    //if a modifier is pressed
    if (modifiers.find(m => m === s)) {

      if (s === 'hyper') {
        if (hyperPressed) {
          setKEYS(DefaultKEYS)
          setHyperPressed(false)
          setModifiersPressed([])
          setFnPressed(false)
        } else {
          setHyperPressed(true)
          const hyperKeys = ['ctrl', 'alt', 'cmd', 'shift']
          setModifiersPressed(hyperKeys)
          setKEYS(rows => rows.map(row => row.map(k => hyperKeys.find(h => h === k.keyCode) || k.keyCode === 'hyper' ? ({...k, pressed: true}) : k)))
        }
      } else if (s === 'fn') {
        setFnPressed(!fnPressed)
        setKEYS(rows => rows.map(row => row.map(k => k.keyCode === s ? ({...k, pressed: !k.pressed}) : k)))
        if (fnPressed) {
          setKEYS(DefaultKEYS)
          setHyperPressed(false)
          setModifiersPressed([])
        }
      } else {
        setHyperPressed(false)
        setKEYS(rows => rows.map(row => row.map(k => k.keyCode === s || k.keyCode === 'hyper' ? ({...k, pressed: k.keyCode === 'hyper' ? false : !k.pressed}) : k)))
        if (modifiersPressed.find(m => m === s)) {
          setModifiersPressed(m => m.filter(k => k !== s))
        } else {
          setModifiersPressed(m => [...m, s])
        }
      }
      return;
    }

    // if shift is pressed
    if (modifiersPressed.length === 1 && modifiersPressed[0] === 'shift') {
      fetch(`http://${window.location.hostname}:1301/shift`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keys: [s],
        }),
      })
      setKEYS(DefaultKEYS)
      setHyperPressed(false)
      setModifiersPressed([])
      return;
    }

    //default case of sending through
    fetch(`http://${window.location.hostname}:1301/keyboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keys: [...modifiersPressed, s],
      }),
    })
    if (!fnPressed) {
      setKEYS(DefaultKEYS)
      setHyperPressed(false)
      setModifiersPressed([])
    }
    return;
  }

  useEffect(() => {
    setIsSwiping(fnPressed)
  }, [fnPressed])

  const cancelText = () => {
    setTyping(false)
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
    setTyping(false)  
    setText("")
  }

  return (
    <>
      {typing && 
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
      </div>}
      {!typing && 
      <div className={`flex relative flex-col transition-transform duration-500 ${flipped ? "portrait:rotate-90" : "portrait:-rotate-90"} landscape:scale-[50%] landscape:sm:scale-75 landscape:md:scale-100 justify-center items-center gap-2`}>
        {/* <div className="absolute size-4 -top-0 -translate-y-full -translate-x-full -left-0 text-white">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M11.95 18q.525 0 .888-.363t.362-.887t-.362-.888t-.888-.362t-.887.363t-.363.887t.363.888t.887.362m-.9-3.85h1.85q0-.825.188-1.3t1.062-1.3q.65-.65 1.025-1.238T15.55 8.9q0-1.4-1.025-2.15T12.1 6q-1.425 0-2.312.75T8.55 8.55l1.65.65q.125-.45.563-.975T12.1 7.7q.8 0 1.2.438t.4.962q0 .5-.3.938t-.75.812q-1.1.975-1.35 1.475t-.25 1.825M12 22q-2.075 0-3.9-.787t-3.175-2.138T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"/></svg>
        </div> */}
        <div className="p-1 w-fit flex flex-col gap-1 rounded-md bg-slate-800">
          {KEYS.map((row, i) => (
            <div className="flex gap-1">
              {row.map(k => <Key {...k} display={k.keyCode === 'space' ? log : k.display} onClick={handleClick} />)}
              {i === KEYS.length - 1 && <ArrowKeys onClick={handleClick} />}
            </div>
          ))}
        </div>
      </div>}
    </>
  )
}