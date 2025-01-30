export type KeyType = {
  width?: number
  display?: React.ReactNode | string
  pressed?: boolean
  keyCode: string
}

export type Direction = "up" | "down" | "left" | "right"

export type CanClick = {
  onClick: (s: string) => void
}