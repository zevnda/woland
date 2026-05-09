export interface Device {
  id: string
  name: string
  color: string
  mac: string
  ip: string
}

export type Screen = 'power' | 'devices' | 'form'

export const COLORS = [
  '#2373ea',
  '#e23c3c',
  '#2ea043',
  '#e28b2e',
  '#9333ea',
  '#ea33ab',
  '#14b8a6',
  '#eab308',
]
