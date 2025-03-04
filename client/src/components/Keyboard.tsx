import { useEffect, useState } from "react"

import { ArrowKeys } from "./ArrowKeys"
import { KEYS as DefaultKEYS } from "../KEYS"
import { Help } from "./Help"
import { Key } from "./Key"
import { Mouse } from "./Mouse"
import { Tapping } from "./Tapping"
import { Typing } from "./Typing"

const modifiers = ['hyper', 'ctrl', 'fn', 'alt', 'cmd', 'shift']
const functionKeys = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12']

type KeyboardProps = {
  log?: string
  isSwiping?: boolean
  setIsSwiping?: (b: boolean) => void
}

export const Keyboard = ({log="", isSwiping=true, setIsSwiping=()=>{}}: KeyboardProps) => {

  const [flipped, setFlipped] = useState(false)
  const [fnPressed, setFnPressed] = useState(false)
  const [hyperPressed, setHyperPressed] = useState(false)
  const [KEYS, setKEYS] = useState(DefaultKEYS)
  const [modifiersPressed, setModifiersPressed] = useState<string[]>([])
  const [state, setState] = useState("KEYBOARD")
  const [prevState, setPrevState] = useState("KEYBOARD")
  const [tappingKey, setTappingKey] = useState("")
  const [selectingKey, setSelectingKey] = useState(false)
  
  const changeState = (s: string) => {
    setPrevState(state)
    setState(s)
  }

  const handleKeyPress = (s: string) => {

    if (selectingKey) {
      setTappingKey(s)
      changeState("TAPPING")
      setSelectingKey(false)
      setIsSwiping(true)
      return;
    }

    if (fnPressed && modifiersPressed.length === 0 && !modifiers.find(m => m === s)) {
      if (s === 'space') {
        changeState("TYPING")
      }
      if (s === '/') {
        setFlipped(!flipped)
      }
      if (s === 'lock') {
        changeState("MOUSE")
      }
      if (s === '`') {
        setSelectingKey(true)
      }
      if (functionKeys.find(f => f === s)) {
        fetch(`http://${window.location.hostname}:1301/keyboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keys: [s],
          }),
        })
        return;
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
        setKEYS(rows => rows.map(row => row.map(k => k.keyCode === s || k.keyCode === 'hyper' || k.keyCode === 'fn' ? ({...k, pressed: k.keyCode === 'hyper' ? false : k.keyCode === 'fn' ? fnPressed : !k.pressed}) : k)))
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

  return (
    <>
      {state === "HELP" && <Help changeState={changeState}/>}
      {state === "TYPING" && <Typing prevState={() => changeState(prevState)}/>}
      {state === "MOUSE" && <Mouse changeState={changeState} flipped={flipped} isSwiping={isSwiping} setIsSwiping={setIsSwiping} />}
      {state === "TAPPING" && <Tapping changeState={changeState} tappingKey={tappingKey} />}
      
      {state === "KEYBOARD" && 
      <div className={`flex relative flex-col transition-transform duration-500 ${flipped ? "portrait:rotate-90" : "portrait:-rotate-90"} landscape:scale-[50%] landscape:sm:scale-75 landscape:md:scale-100 justify-center items-center gap-2`}>
        <button onClick={() => changeState("HELP")} className="absolute size-4 -top-0 -translate-y-full -translate-x-full -left-0 text-neutral-800">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M11.95 18q.525 0 .888-.363t.362-.887t-.362-.888t-.888-.362t-.887.363t-.363.887t.363.888t.887.362m-.9-3.85h1.85q0-.825.188-1.3t1.062-1.3q.65-.65 1.025-1.238T15.55 8.9q0-1.4-1.025-2.15T12.1 6q-1.425 0-2.312.75T8.55 8.55l1.65.65q.125-.45.563-.975T12.1 7.7q.8 0 1.2.438t.4.962q0 .5-.3.938t-.75.812q-1.1.975-1.35 1.475t-.25 1.825M12 22q-2.075 0-3.9-.787t-3.175-2.138T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"/></svg>
        </button>
        {selectingKey && <p className="absolute left-1/2 -translate-x-1/2 -bottom-2 translate-y-full">Press the key to Select</p>}
        <div className="p-1 w-fit flex flex-col gap-1 rounded-md bg-slate-800">
          {KEYS.map((row, i) => (
            <div className="flex gap-1">
              {row.map(k => <Key {...k} display={k.keyCode === 'space' ? log : k.display} onClick={handleKeyPress} />)}
              {i === KEYS.length - 1 && <ArrowKeys onClick={handleKeyPress} />}
            </div>
          ))}
        </div>
      </div>}

    </>
  )
}