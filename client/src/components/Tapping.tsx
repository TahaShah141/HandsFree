type TappingProps = {
  changeState: (s: string) => void
  tappingKey: string
}

export const Tapping = ({ changeState, tappingKey }: TappingProps) => {

  const tapKey = () => {
    fetch(`http://${window.location.hostname}:1301/keyboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keys: [tappingKey],
      }),
    })
  }

  return (
    <div onClick={() => changeState("KEYBOARD")} className="size-full py-8">
      <div onClick={(e) => {e.stopPropagation(); tapKey()}} className="size-full rounded-xl bg-neutral-900 border border-neutral-800">
      </div>
    </div>
  )
}
