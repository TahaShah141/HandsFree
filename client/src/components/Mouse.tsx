import { useEffect, useRef, useState } from "react";

import { useKeyboard } from "../lib/hooks/useKeyboard";

type MouseProps = {
  changeState: (s: string) => void;
  flipped: boolean;
  isSwiping: boolean;
  setIsSwiping: (b: boolean) => void;
}

const RELOAD_DELAY = 150

export const Mouse = ({ changeState, flipped, isSwiping, setIsSwiping }: MouseProps) => {

  const [img, setImg] = useState("")
  const [loadingImage, setLoadingImage] = useState(false)
  const [clicking, setClicking] = useState(true)
  const [isPortrait, setIsPortrait] = useState(true)
  const [flipY, setFlipY] = useState(false)
  const [magnifierX, setMagnifierX] = useState(0);
  const [magnifierY, setMagnifierY] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [dragging, setDragging] = useState(false)
  const [autoReload, setAutoReload] = useState(false)
  const [autoReloadID, setAutoReloadID] = useState(-1)
  const magnifierSize = 50;  // Size of the zoom window
  const zoomFactor = 3;  // How much to zoom in
  const imgRef = useRef<HTMLImageElement>(null);

  useKeyboard()
  

  const handleMove = (event: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
    if (isSwiping || !imgRef.current) return;
  
    let clientX, clientY;
  
    if ("touches" in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }
  
    const imgRect = imgRef.current.getBoundingClientRect();
    const relativeX = clientX - imgRect.left;
    const relativeY = clientY - imgRect.top;
 
    const magX = relativeX + (isPortrait && flipped !== flipY || !isPortrait && flipped  ? 1 : -1) * (isPortrait ? magnifierSize : magnifierSize / 2)
    const magY = relativeY - (isPortrait && flipped || !isPortrait && flipped !== flipY ? -1 : 1) * (!isPortrait ? magnifierSize : magnifierSize / 2)
    const W = imgRef.current.width
    const H = imgRef.current.height

    setMagnifierX(flipped ? W - magX : magX);
    setMagnifierY(flipped ? H - magY : magY);
    setTimeout(() => setShowMagnifier(true), 100);
    setDragging(true);
  };

  const handleLeave = async () => {
    if (isSwiping || !imgRef.current) return;

    const clickX = magnifierX / imgRef.current.width
    const clickY = magnifierY / imgRef.current.height

    await fetch(`http://${window.location.hostname}:1301/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        y: isPortrait ? clickX : clickY,
        x: isPortrait ?  1 - clickY : clickX,
        clicking,
      }),
    })

    // if (clicking) updateScreenShot()
    if (clicking) setTimeout(() => updateScreenShot(), RELOAD_DELAY)
    setShowMagnifier(false);
    setDragging(false);
  };

  useEffect(() => {
    setIsPortrait(window.matchMedia("(orientation: portrait)").matches)
    window.matchMedia("(orientation: portrait)").addEventListener("change", (e) => {setIsPortrait(e.matches);})
  }, [])

  useEffect(() => {
    updateScreenShot()
  }, [])

  const updateScreenShot = async () => {
    if (loadingImage) return;
    setLoadingImage(true)
    await fetch(`http://${window.location.hostname}:1301/screen?rotate=${isPortrait}`)
    setImg(`/screen.png?timestamp=${new Date().getTime()}`)    
    setLoadingImage(false)
  }

  const clickScreen = async (e?: React.MouseEvent<HTMLImageElement>) => {

    if (!e) {
      await fetch(`http://${window.location.hostname}:1301/click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          y: -1,
          x: -1,
          clicking: true
        }),
      })

      setTimeout(() => updateScreenShot(), RELOAD_DELAY)
      return;
    }

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
        x: isPortrait ? 1 - clickY : clickX,
        clicking
      }),
    })

    // if (clicking) updateScreenShot()
    if (clicking) setTimeout(() => updateScreenShot(), RELOAD_DELAY)
  }

  // Auto-reload screenshot effect
  useEffect(() => {
    if (!autoReload) {
      clearInterval(autoReloadID)
    } else {
      const ID = setInterval(() => updateScreenShot(), 2000)
      setAutoReloadID(ID)
    }

    return () => clearInterval(autoReloadID)
  }, [autoReload]);

  return (
    <div onClick={() => changeState("KEYBOARD")} className={`flex size-full justify-center items-center p-6 gap-2 ${flipped && "portrait:rotate-180"}`}>
      {loadingImage && !img ? 
      <p className="portrait:-rotate-90 animate-pulse">Loading Screenshot...</p> :
      <div onClick={(e) => {e.stopPropagation()}} className="flex portrait:flex-col landscape:flex-row-reverse justify-center portrait:items-center gap-2">
        <div className="flex landscape:flex-col gap-2 p-2 justify-between portrait:w-full">
          <div className="flex landscape:flex-col gap-2">
          <button onClick={() => setFlipY(!flipY)} className={`size-12 portrait:-rotate-90 bg-neutral-800 p-2 border-2 rounded-md ${flipY ? "text-white border-white" : "text-neutral-400 border-neutral-600"}`}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 3l-5 5l-5-5zm0 18l-5-5l-5 5zM4 12H2m8 0H8m8 0h-2m8 0h-2"/></svg>
            </button>    
            <button onClick={updateScreenShot} className="size-12 portrait:-rotate-90 bg-neutral-800 p-2 border-neutral-600 border-2 rounded-md">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M17.65 6.35A7.96 7.96 0 0 0 12 4a8 8 0 0 0-8 8a8 8 0 0 0 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18a6 6 0 0 1-6-6a6 6 0 0 1 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"/></svg>
            </button>            
          </div>
          
          <div className="flex landscape:flex-col gap-2">
            <button onClick={() => changeState("TYPING")} className="size-12 portrait:-rotate-90 bg-neutral-800 p-2 border-neutral-600 border-2 rounded-md">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M6 16h12v2H6zm0-3v2H2v-2zm1 2v-2h3v2zm4 0v-2h2v2zm3 0v-2h3v2zm4 0v-2h4v2zM2 10h3v2H2zm17 2v-2h3v2zm-1 0h-2v-2h2zM8 12H6v-2h2zm4 0H9v-2h3zm3 0h-2v-2h2zM2 9V7h2v2zm3 0V7h2v2zm3 0V7h2v2zm3 0V7h2v2zm3 0V7h2v2zm3 0V7h5v2z"/></svg>
            </button>
            <button onClick={() => clickScreen()} className="size-12 portrait:-rotate-90 bg-neutral-800 p-2 border-neutral-600 border-2 rounded-md">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m7 10h-4v2h4a2 2 0 0 0 2-2v-4h-2m0-12h-4v2h4v4h2V5a2 2 0 0 0-2-2M5 5h4V3H5a2 2 0 0 0-2 2v4h2m0 6H3v4a2 2 0 0 0 2 2h4v-2H5z"/></svg>
            </button>
          </div>

          <div className="flex landscape:flex-col gap-2">
            <button onClick={() => setClicking(!clicking)} className={`size-12 portrait:-rotate-90 bg-neutral-800 p-2 border-2 rounded-md ${clicking ? "text-white border-white" : "text-neutral-400 border-neutral-600"}`}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M10.76 8.69a.76.76 0 0 0-.76.76V20.9c0 .42.34.76.76.76c.19 0 .35-.06.48-.16l1.91-1.55l1.66 3.62c.13.27.4.43.69.43c.11 0 .22 0 .33-.08l2.76-1.28c.38-.18.56-.64.36-1.01L17.28 18l2.41-.45a.9.9 0 0 0 .43-.26c.27-.32.23-.79-.12-1.08l-8.74-7.35l-.01.01a.76.76 0 0 0-.49-.18M15 10V8h5v2zm-1.17-5.24l2.83-2.83l1.41 1.41l-2.83 2.83zM10 0h2v5h-2zM3.93 14.66l2.83-2.83l1.41 1.41l-2.83 2.83zm0-11.32l1.41-1.41l2.83 2.83l-1.41 1.41zM7 10H2V8h5z"/></svg>
            </button>            
            <button onClick={() => setIsSwiping(!isSwiping)} className={`size-12 portrait:-rotate-90 bg-neutral-800 p-2 border-2 rounded-md ${isSwiping ? "text-white border-white" : "text-neutral-400 border-neutral-600"}`}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20.11 3.89L22 2v5h-5l2.08-2.08c-.53-.69-1.44-1.26-2.72-1.73S13.63 2.5 12 2.5c-1.62 0-3.08.22-4.36.69S5.45 4.23 4.92 4.92L7 7H2V2l1.89 1.89C4.64 3 5.74 2.31 7.2 1.78C8.65 1.25 10.25 1 12 1s3.35.25 4.8.78c1.46.53 2.56 1.22 3.31 2.11m-.38 12.38v.18L19 21.7c-.08.38-.24.69-.5.94c-.27.25-.59.36-.97.36h-6.8c-.37 0-.73-.14-1.03-.45l-4.97-4.92l.8-.8c.22-.22.47-.33.8-.33h.23l3.44.75V6.5c0-.39.13-.74.43-1.04S11.08 5 11.5 5c.39 0 .74.16 1.04.46s.46.65.46 1.04v6h.78c.1 0 .27.05.52.11l4.54 2.25c.6.28.89.75.89 1.41"/></svg>
            </button>            
            {/* <button onClick={() => setAutoReload(!autoReload)} className={`size-12 portrait:-rotate-90 bg-neutral-800 p-2 border-2 rounded-md ${autoReload ? "text-white border-white" : "text-neutral-400 border-neutral-600"}`}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10 2h4m-2 12v-4m-8 3a8 8 0 0 1 8-7a8 8 0 1 1-5.3 14L4 17.6"/><path d="M9 17H4v5"/></g></svg>
            </button>             */}
          </div>
        </div>
        <div className="relative">

          <img 
            className={`border max-h-[95vh] relative rounded-md ${loadingImage && "animate-pulse"}`}
            ref={imgRef} draggable={false}
            // onMouseMove={handleMove} 
            // onMouseLeave={handleLeave} 
            onTouchMove={handleMove} 
            onTouchEnd={handleLeave} 
            src={img} onClick={clickScreen} 
          />

          {showMagnifier && dragging && (
            <div 
            className={`border-2 absolute border-neutral-500 bg-neutral-900 rounded-full overflow-hidden shadow-lg opacity-0 scale-0 animate-fade-in`}
            style={{
              width: magnifierSize,
              height: magnifierSize,
              top: `${magnifierY}px`, // Slightly below the cursor
              left: `${magnifierX}px`, // Slightly to the right of the cursor
            }}
            >
              <div
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundPosition: `${-magnifierX * zoomFactor + magnifierSize / 2}px ${-magnifierY * zoomFactor + magnifierSize / 2}px`,
                  backgroundSize: `${imgRef.current?.width! * zoomFactor}px ${imgRef.current?.height! * zoomFactor}px`,
                  width: "100%",
                  height: "100%",
                  transform: `scale(${zoomFactor})`,
                }}
                className="relative"
                >
                <svg className={`absolute top-1/2 left-1/2 size-0.5 -translate-x-1/2 -translate-y-1/2 ${flipY ? "text-red-500" : "text-green-500"}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M12 8a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m-8.95 5H1v-2h2.05C3.5 6.83 6.83 3.5 11 3.05V1h2v2.05c4.17.45 7.5 3.78 7.95 7.95H23v2h-2.05c-.45 4.17-3.78 7.5-7.95 7.95V23h-2v-2.05C6.83 20.5 3.5 17.17 3.05 13M12 5a7 7 0 0 0-7 7a7 7 0 0 0 7 7a7 7 0 0 0 7-7a7 7 0 0 0-7-7"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>}
    </div>
  )
}
