
type HelpProps = {
  changeState: (state: string) => void;
}

export const Help = ({changeState} : HelpProps) => {
  return (
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
    </div>
  )
}
