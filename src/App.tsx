import { useState, useEffect, useCallback } from 'react'
import type { Device, Screen } from './lib/types'
import { loadDevices, saveDevices, loadSelectedId, saveSelectedId } from './lib/storage'
import DeviceForm from './components/DeviceForm'
import PowerScreen from './components/PowerScreen'
import { Toast } from '@heroui/react'

export default function App() {
  const [devices, setDevices] = useState<Device[]>(loadDevices)
  const [selectedId, setSelectedId] = useState<string | null>(loadSelectedId)
  const [screen, setScreen] = useState<Screen>('devices')
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)

  // Restore last used device on mount
  useEffect(() => {
    const devices = loadDevices()
    const selectedId = loadSelectedId()
    if (selectedId && devices.find(d => d.id === selectedId)) {
      setScreen('power')
    } else {
      setScreen('form')
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
    saveSelectedId(device.id)
    setSelectedId(device.id)
    setScreen('power')
  }, [])

  const handleDeleteDevice = useCallback(
    (id: string) => {
      setDevices(prev => {
        const next = prev.filter(d => d.id !== id)
        saveDevices(next)
        return next
      })
      const updatedDevices = loadDevices()
      if (updatedDevices.length === 0) {
        saveSelectedId(null)
        setSelectedId(null)
        setScreen('form')
        return
      }
      if (selectedId === id) {
        setSelectedId(devices.length > 1 ? devices.find(d => d.id !== id)?.id || null : null)
        saveSelectedId(devices.length > 1 ? devices.find(d => d.id !== id)?.id || null : null)
      }
    },
    [selectedId],
  )

  if (screen === 'form') {
    return (
      <DeviceForm
        devices={devices}
        device={editingDevice}
        onSave={handleSaveDevice}
        onCancel={() => {
          setEditingDevice(null)
          setScreen('power')
        }}
      />
    )
  }

  if (selectedDevice) {
    return (
      <>
        <Toast.Provider />
        <PowerScreen
          device={selectedDevice}
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
      </>
    )
  }

  return null
}
