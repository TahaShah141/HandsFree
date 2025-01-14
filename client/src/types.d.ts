export type KeyType = {
  width?: number
  display?: React.ReactNode | string
  keyCode: string
}

export type CanClick = {
  onClick: (s: string) => void
}