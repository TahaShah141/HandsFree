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

  const [fnPressed, setFnPressed] = useState(false)
  const [hyperPressed, setHyperPressed] = useState(false)
  const [KEYS, setKEYS] = useState(DefaultKEYS)
  const [modifiersPressed, setModifiersPressed] = useState<string[]>([])

  const handleClick = (s: string) => {
    
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

  return (
    <div className="flex flex-col portrait:-rotate-90 landscape:scale-[50%] landscape:sm:scale-75 landscape:md:scale-100 justify-center items-center gap-2">
      <div className="p-1 w-fit flex flex-col gap-1 rounded-md bg-slate-800">
        {KEYS.map((row, i) => (
          <div className="flex gap-1">
            {row.map(k => <Key {...k} display={k.keyCode === 'space' ? log : k.display} onClick={handleClick} />)}
            {i === KEYS.length - 1 && <ArrowKeys onClick={handleClick} />}
          </div>
        ))}
      </div>
    </div>
  )
}