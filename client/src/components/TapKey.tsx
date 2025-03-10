import { TapKeyType } from "../types"

type TapKeyProps = {
  keys: TapKeyType
  isVertical: boolean
  onClick: (keyCode: string, position: number[]) => void
  position: number[]
}

export const TapKey = ({keys, position, isVertical, onClick}: TapKeyProps) => {
  return (
    <div className={`flex size-full gap-2 ${isVertical ? "flex-col" : "flex-row"}`}>
      {keys.tapKeys.map((k, i) => (
        // typeof k === 'string' ?
        'keyCode' in k ? 
        <div onClick={(e) => {e.stopPropagation(); onClick(k.keyCode, [...position, i])}} className="size-full text-xs flex justify-center items-center bg-neutral-800 font-mono rounded-md text-white">
          {k.keyCode.toUpperCase()}
        </div> :
        <TapKey position={[...position, i]} keys={k} isVertical={!isVertical} onClick={onClick}/>
      ))}
    </div>
  )
}