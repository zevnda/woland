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

export async function exportDevices(devices: Device[]): Promise<string> {
  const json = JSON.stringify(devices, null, 2)
  const bridge = (window as any).FilesBridge
  if (!bridge) return 'error: not supported on this platform'
  return String(bridge.exportDevices(json))
}

export function importDevices(): Promise<Device[] | null> {
  return new Promise(resolve => {
    const bridge = (window as any).FilesBridge
    if (!bridge) return resolve(null)
    ;(window as any).__onDevicesImported = () => {
      delete (window as any).__onDevicesImported
      const json: string = bridge.getImportedJson() ?? ''
      if (!json) return resolve(null)
      try {
        const parsed = JSON.parse(json)
        resolve(Array.isArray(parsed) ? (parsed as Device[]) : null)
      } catch {
        resolve(null)
      }
    }
    bridge.importDevices()
  })
}
