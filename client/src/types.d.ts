export type KeyType = {
  width?: number
  display: React.ReactNode | string
  pressed?: boolean
  keyCode: string
}

export type TapKeyType = {
  tapKeys: (KeyType | TapKeyType)[]
}


export type Direction = "up" | "down" | "left" | "right"

export type CanClick = {
  onClick: (k: KeyType) => void
}

export type AddTappingKeyOptionsType = {
  position: number[]
  type: "ADD" | "SPLIT" | "DELETE"
  index: number
}