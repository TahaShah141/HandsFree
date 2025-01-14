
import down from '../assets/down.svg'
import up from '../assets/up.svg'
import right from '../assets/right.svg'
import left from '../assets/left.svg'

export const ArrowKeys = () => {
  return (
    <div className="flex flex-1 gap-1 items-end">
      <div style={{aspectRatio: `2 / 1`}} className="h-1/2 px-2 py-1 border-[0.5px] border-white/50 text-xs flex justify-center items-center bg-black rounded-md text-white">
        <img className="size-1.5" src={left} />
      </div>  

      <div className="flex flex-col flex-1 gap-px h-full">
        <div className="flex-1 w-full px-2 py-1 border-[0.5px] border-white/50 text-xs flex justify-center items-center bg-black rounded-t-md text-white">
          <img className="size-1.5" src={up} />
        </div>
        <div className="flex-1 w-full px-2 py-1 border-[0.5px] border-white/50 text-xs flex justify-center items-center bg-black rounded-b-md text-white">
          <img className="size-1.5" src={down} />
        </div>
      </div>

      <div style={{aspectRatio: `2 / 1`}} className="h-1/2 px-2 py-1 border-[0.5px] border-white/50 text-xs flex justify-center items-center bg-black rounded-md text-white">
        <img className="size-1.5" src={right} />
      </div>  
    </div>
  )
}