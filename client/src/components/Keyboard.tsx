import { useEffect, useState } from "react"
import { KEYS as DefaultKEYS } from "../KEYS"
import { ArrowKeys } from "./ArrowKeys"
import { Key } from "./Key"

const modifiers = ['hyper', 'ctrl', 'fn', 'alt', 'cmd', 'shift']

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
  const [text, setText] = useState("")
  const [img, setImg] = useState("")
  const [loadingImage, setLoadingImage] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    setIsPortrait(window.matchMedia("(orientation: portrait)").matches)
    window.matchMedia("(orientation: portrait)").addEventListener("change", (e) => {setIsPortrait(e.matches); updateScreenShot()})
  }, [])

  const changeState = (s: string) => {
    setPrevState(state)
    setState(s)
  }

  const updateScreenShot = async () => {
    if (loadingImage) return;
    setLoadingImage(true)
    await fetch(`http://${window.location.hostname}:1301/screen?rotate=${isPortrait}`)
    setImg(`/screen.png?timestamp=${new Date().getTime()}`)    
    setLoadingImage(false)
  }

  const clickScreen = async (e: React.MouseEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement

    const clickX = e.nativeEvent.offsetX / img.width
    const clickY = e.nativeEvent.offsetY / img.height

    await fetch(`http://${window.location.hostname}:1301/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        y: isPortrait ? clickX : clickY,
        x: isPortrait ?  1 - clickY : clickX,
        clicking
      }),
    })

    if (clicking) setTimeout(() => updateScreenShot(), 300)
  }

  const handleClick = (s: string) => {

    if (fnPressed && modifiersPressed.length === 0 && !modifiers.find(m => m === s)) {
      if (s === 'space') {
        changeState("TYPING")
      }
      if (s === '/') {
        setFlipped(!flipped)
      }
      if (s === 'lock') {
        changeState("CLICK")
        if (!img) updateScreenShot()
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

  const cancelText = () => {
    changeState(prevState)
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
    changeState(prevState)
    setText("")
  }

  return (
    <>
      {state === "HELP" && 
      <div onClick={() => changeState("KEYBOARD")} className="flex h-screen w-full gap-2 justify-center items-center">
        <div className="flex relative text-sm flex-col items-center justify-center bg-neutral-900 rounded-md p-4 gap-2">
        <h1 className="text-3xl font-bold">Info</h1>
        <p>This virtual keyboard, developed by Taha Shah, allows wireless control of a Mac (or any laptop) from a web-accessible device.</p>
        <p>Usage is simple—press keys as on a normal keyboard. Modifier keys toggle when tapped.</p>
        <p className="text-xl font-bold">Extra shortcuts:</p>
        <ul>
          <li className="before:content-['•'] before:mr-1"><b>fn</b>: Keeps modifiers active after a shortcut.</li>
          <li className="before:content-['•'] before:mr-1"><b>caps_lock (hyperkey)</b>: Toggles all modifiers.</li>
          <li className="before:content-['•'] before:mr-1"><b>fn + space</b>: Opens typing mode for faster input.</li>
          <li className="before:content-['•'] before:mr-1"><b>fn</b>: Enables swipe gestures for mouse scroll.</li>
          <li className="before:content-['•'] before:mr-1"><b>hyper + power</b>: Shuts down both servers, exiting the app.</li>
          <li className="before:content-['•'] before:mr-1"><b>fn + /</b>: Flips the keyboard.</li>
          <li className="before:content-['•'] before:mr-1"><b>Power button</b>: Locks Mac (if <b>hyper + esc</b> is set).</li>
        </ul>
        </div>
      </div>}

      {state === "TYPING" && 
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

      {state === "KEYBOARD" && 
      <div className={`flex relative flex-col transition-transform duration-500 ${flipped ? "portrait:rotate-90" : "portrait:-rotate-90"} landscape:scale-[50%] landscape:sm:scale-75 landscape:md:scale-100 justify-center items-center gap-2`}>
        <button onClick={() => changeState("HELP")} className="absolute size-4 -top-0 -translate-y-full -translate-x-full -left-0 text-neutral-800">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M11.95 18q.525 0 .888-.363t.362-.887t-.362-.888t-.888-.362t-.887.363t-.363.887t.363.888t.887.362m-.9-3.85h1.85q0-.825.188-1.3t1.062-1.3q.65-.65 1.025-1.238T15.55 8.9q0-1.4-1.025-2.15T12.1 6q-1.425 0-2.312.75T8.55 8.55l1.65.65q.125-.45.563-.975T12.1 7.7q.8 0 1.2.438t.4.962q0 .5-.3.938t-.75.812q-1.1.975-1.35 1.475t-.25 1.825M12 22q-2.075 0-3.9-.787t-3.175-2.138T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"/></svg>
        </button>
        <div className="p-1 w-fit flex flex-col gap-1 rounded-md bg-slate-800">
          {KEYS.map((row, i) => (
            <div className="flex gap-1">
              {row.map(k => <Key {...k} display={k.keyCode === 'space' ? log : k.display} onClick={handleClick} />)}
              {i === KEYS.length - 1 && <ArrowKeys onClick={handleClick} />}
            </div>
          ))}
        </div>
      </div>}

      {state === "CLICK" &&
      <div onClick={() => changeState("KEYBOARD")} className={`flex size-full justify-center items-center p-6 gap-2 ${flipped && "portrait:rotate-180"}`}>
        {loadingImage && !img ? 
        <p className="portrait:-rotate-90 animate-pulse">Loading Screenshot...</p> :
        <div onClick={(e) => {e.stopPropagation()}} className="flex portrait:flex-col landscape:flex-row-reverse justify-center items-center gap-2">
          <div className="flex landscape:flex-col gap-2 p-2 justify-between w-full">
            <div className="flex landscape:flex-col gap-2">
              <button onClick={() => changeState("KEYBOARD")} className="size-12 portrait:-rotate-90 bg-neutral-800 p-2 border-neutral-600 border-2 rounded-md">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
              </button>            
              <button onClick={updateScreenShot} className="size-12 portrait:-rotate-90 bg-neutral-800 p-2 border-neutral-600 border-2 rounded-md">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 0 0-8 8a8 8 0 0 0 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18a6 6 0 0 1-6-6a6 6 0 0 1 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"/></svg>
              </button>            
            </div>
            
            <button onClick={() => changeState("TYPING")} className="size-12 portrait:-rotate-90 bg-neutral-800 p-2 border-neutral-600 border-2 rounded-md">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M6 16h12v2H6zm0-3v2H2v-2zm1 2v-2h3v2zm4 0v-2h2v2zm3 0v-2h3v2zm4 0v-2h4v2zM2 10h3v2H2zm17 2v-2h3v2zm-1 0h-2v-2h2zM8 12H6v-2h2zm4 0H9v-2h3zm3 0h-2v-2h2zM2 9V7h2v2zm3 0V7h2v2zm3 0V7h2v2zm3 0V7h2v2zm3 0V7h2v2zm3 0V7h5v2z"/></svg>
            </button>            

            <div className="flex landscape:flex-col gap-2">
              <button onClick={() => setClicking(!clicking)} className={`size-12 portrait:-rotate-90 bg-neutral-800 p-2 border-2 rounded-md ${clicking ? "text-white border-white" : "text-neutral-400 border-neutral-600"}`}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10.76 8.69a.76.76 0 0 0-.76.76V20.9c0 .42.34.76.76.76c.19 0 .35-.06.48-.16l1.91-1.55l1.66 3.62c.13.27.4.43.69.43c.11 0 .22 0 .33-.08l2.76-1.28c.38-.18.56-.64.36-1.01L17.28 18l2.41-.45a.9.9 0 0 0 .43-.26c.27-.32.23-.79-.12-1.08l-8.74-7.35l-.01.01a.76.76 0 0 0-.49-.18M15 10V8h5v2zm-1.17-5.24l2.83-2.83l1.41 1.41l-2.83 2.83zM10 0h2v5h-2zM3.93 14.66l2.83-2.83l1.41 1.41l-2.83 2.83zm0-11.32l1.41-1.41l2.83 2.83l-1.41 1.41zM7 10H2V8h5z"/></svg>
              </button>            
              <button onClick={() => setIsSwiping(!isSwiping)} className={`size-12 portrait:-rotate-90 bg-neutral-800 p-2 border-2 rounded-md ${isSwiping ? "text-white border-white" : "text-neutral-400 border-neutral-600"}`}>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20.11 3.89L22 2v5h-5l2.08-2.08c-.53-.69-1.44-1.26-2.72-1.73S13.63 2.5 12 2.5c-1.62 0-3.08.22-4.36.69S5.45 4.23 4.92 4.92L7 7H2V2l1.89 1.89C4.64 3 5.74 2.31 7.2 1.78C8.65 1.25 10.25 1 12 1s3.35.25 4.8.78c1.46.53 2.56 1.22 3.31 2.11m-.38 12.38v.18L19 21.7c-.08.38-.24.69-.5.94c-.27.25-.59.36-.97.36h-6.8c-.37 0-.73-.14-1.03-.45l-4.97-4.92l.8-.8c.22-.22.47-.33.8-.33h.23l3.44.75V6.5c0-.39.13-.74.43-1.04S11.08 5 11.5 5c.39 0 .74.16 1.04.46s.46.65.46 1.04v6h.78c.1 0 .27.05.52.11l4.54 2.25c.6.28.89.75.89 1.41"/></svg>
              </button>            
            </div>
          </div>
          <img src={img} onClick={clickScreen} className={`border max-h-[95vh] rounded-md ${loadingImage && "animate-pulse"}`}/>
        </div>}
      </div>}
    </>
  )
}