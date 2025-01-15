import { useState } from "react"
import { KEYS as DefaultKEYS } from "../KEYS"
import { ArrowKeys } from "./ArrowKeys"
import { Key } from "./Key"

const modifiers = ['hyper', 'ctrl', 'fn', 'alt', 'cmd', 'shift']

export const Keyboard = () => {

  const [hyperPressed, setHyperPressed] = useState(false)
  const [KEYS, setKEYS] = useState(DefaultKEYS)
  const [modifiersPressed, setModifiersPressed] = useState<string[]>([])

  const handleClick = (str: string[]) => {
    
    const s = str[0]

    //use power key
    if (s === 'lock') {

      if (hyperPressed) {
        fetch(`http://${window.location.hostname}:3000/kill`)
        setTimeout(() => window.location.reload(), 500)
        return
      }

      console.log("locking")
      fetch(`http://${window.location.hostname}:3000/keyboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keys: ['ctrl', 'alt', 'cmd', 'shift', 'escape'],
        }),
      })
      setKEYS(DefaultKEYS)
      setHyperPressed(false)
      setModifiersPressed([])
      return;
    }

    //if a modifier is pressed
    if (modifiers.find(m => m === s)) {

      if (s === 'hyper') {
        if (hyperPressed) {
          setHyperPressed(false)
          setKEYS(DefaultKEYS)
          setModifiersPressed([])
        } else {
          setHyperPressed(true)
          const hyperKeys = ['ctrl', 'alt', 'cmd', 'shift']
          setModifiersPressed(hyperKeys)
          setKEYS(rows => rows.map(row => row.map(k => hyperKeys.find(h => h === k.keyCode[0]) || k.keyCode[0] === 'hyper' ? ({...k, pressed: true}) : k)))
        }
      } else {
        setHyperPressed(false)
        setKEYS(rows => rows.map(row => row.map(k => k.keyCode[0] === s || k.keyCode[0] === 'hyper' ? ({...k, pressed: k.keyCode[0] === 'hyper' ? false : !k.pressed}) : k)))
        if (modifiersPressed.find(m => m === s)) {
          setModifiersPressed(m => m.filter(k => k !== s))
        } else {
          setModifiersPressed(m => [...m, s])
        }
      }
      return;
    }

    //if shift pressed before key
    if (modifiersPressed.length === 1 && modifiersPressed[0] === 'shift') {
      fetch(`http://${window.location.hostname}:3000/keyboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keys: [str[1] ?? str[0]],
        }),
      })
      setModifiersPressed([])
      setKEYS(DefaultKEYS)
      return;
    }

    //default case of sending through
    fetch(`http://${window.location.hostname}:3000/keyboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keys: [...modifiersPressed, s],
      }),
    })
    setKEYS(DefaultKEYS)
    setHyperPressed(false)
    setModifiersPressed([])
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
    </div>
  )
}