import type { Device } from './types'

const DEVICES_KEY = 'woland_devices'
const SELECTED_KEY = 'woland_selected_device'

export function loadDevices(): Device[] {
  try {
    return JSON.parse(localStorage.getItem(DEVICES_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveDevices(devices: Device[]) {
  localStorage.setItem(DEVICES_KEY, JSON.stringify(devices))
}

export function loadSelectedId(): string | null {
  return localStorage.getItem(SELECTED_KEY)
}

export function saveSelectedId(id: string | null) {
  if (id) localStorage.setItem(SELECTED_KEY, id)
  else localStorage.removeItem(SELECTED_KEY)
}
