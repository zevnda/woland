import { useState, useEffect, useCallback } from 'react'
import type { Device, Screen } from './lib/types'
import { loadDevices, saveDevices, loadSelectedId, saveSelectedId } from './lib/storage'
import DeviceList from './components/DeviceList'
import DeviceForm from './components/DeviceForm'
import PowerScreen from './components/PowerScreen'

export default function App() {
  const [devices, setDevices] = useState<Device[]>(loadDevices)
  const [selectedId, setSelectedId] = useState<string | null>(loadSelectedId)
  const [screen, setScreen] = useState<Screen>('devices')
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)

  // Restore last screen on mount
  useEffect(() => {
    const devs = loadDevices()
    const selId = loadSelectedId()
    if (selId && devs.find(d => d.id === selId)) {
      setScreen('power')
    } else {
      setScreen('devices')
    }
  }, [])

  const selectedDevice = devices.find(d => d.id === selectedId) || null

  const handleSelectDevice = useCallback((id: string) => {
    setSelectedId(id)
    saveSelectedId(id)
    setScreen('power')
  }, [])

  const handleSaveDevice = useCallback((device: Device) => {
    setDevices(prev => {
      const exists = prev.find(d => d.id === device.id)
      const next = exists ? prev.map(d => (d.id === device.id ? device : d)) : [...prev, device]
      saveDevices(next)
      return next
    })
    setEditingDevice(null)
    setScreen('devices')
  }, [])

  const handleDeleteDevice = useCallback(
    (id: string) => {
      setDevices(prev => {
        const next = prev.filter(d => d.id !== id)
        saveDevices(next)
        return next
      })
      if (selectedId === id) {
        setSelectedId(null)
        saveSelectedId(null)
      }
    },
    [selectedId],
  )

  if (screen === 'form') {
    return (
      <DeviceForm
        device={editingDevice}
        onSave={handleSaveDevice}
        onCancel={() => {
          setEditingDevice(null)
          setScreen('devices')
        }}
      />
    )
  }

  if (screen === 'devices') {
    return (
      <DeviceList
        devices={devices}
        selectedId={selectedId}
        onSelect={handleSelectDevice}
        onAdd={() => {
          setEditingDevice(null)
          setScreen('form')
        }}
        onEdit={device => {
          setEditingDevice(device)
          setScreen('form')
        }}
        onDelete={handleDeleteDevice}
      />
    )
  }

  if (selectedDevice) {
    return <PowerScreen device={selectedDevice} onBack={() => setScreen('devices')} />
  }

  return null
}
