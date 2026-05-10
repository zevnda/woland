import { invoke } from '@tauri-apps/api/core'
import type { Device } from './types'

const SELECTED_KEY = 'woland_selected_device'

export async function loadDevices(): Promise<Device[]> {
  try {
    const json = await invoke<string>('load_devices')
    return JSON.parse(json)
  } catch {
    return []
  }
}

export async function saveDevices(devices: Device[]): Promise<void> {
  await invoke('save_devices', { devices: JSON.stringify(devices) })
}

export function loadSelectedId(): string | null {
  return localStorage.getItem(SELECTED_KEY)
}

export function saveSelectedId(id: string | null) {
  if (id) localStorage.setItem(SELECTED_KEY, id)
  else localStorage.removeItem(SELECTED_KEY)
}
