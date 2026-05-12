import { useState, useEffect, useCallback } from 'react'
import type { Device, Screen } from './lib/types'
import { loadDevices, saveDevices, loadSelectedId, saveSelectedId } from './lib/storage'
import DeviceForm from './components/DeviceForm'
import PowerScreen from './components/PowerScreen'
import { Spinner, toast, Toast } from '@heroui/react'

export default function App() {
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(loadSelectedId())
  const [screen, setScreen] = useState<Screen | null>(null)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)

  // Load devices from file on mount
  useEffect(() => {
    loadDevices().then(loaded => {
      setDevices(loaded)
      const savedId = loadSelectedId()
      if (savedId && loaded.find(d => d.id === savedId)) {
        setScreen('power')
      } else if (loaded.length > 0) {
        setSelectedId(loaded[0].id)
        saveSelectedId(loaded[0].id)
        setScreen('power')
      } else {
        setScreen('form')
      }
    })
  }, [])

  const selectedDevice = devices.find(d => d.id === selectedId) || null

  const handleSelectDevice = useCallback(
    (id: string) => {
      setSelectedId(id)
      saveSelectedId(id)
      setScreen('power')
      toast(null, {
        description: `Device "${devices.find(d => d.id === id)?.name ?? 'Unknown'}" selected.`,
        variant: 'success',
        timeout: 1500,
      })
    },
    [devices],
  )

  const handleReorderDevices = useCallback((reordered: Device[]) => {
    setDevices(reordered)
    saveDevices(reordered)
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
    toast(null, {
      description: `Device "${device.name}" added successfully!`,
      variant: 'success',
      timeout: 1500,
    })
  }, [])

  const handleDeleteDevice = useCallback(
    (id: string) => {
      setDevices(prev => {
        const next = prev.filter(d => d.id !== id)
        saveDevices(next)
        if (next.length === 0) {
          saveSelectedId(null)
          setSelectedId(null)
          setScreen('form')
        } else if (selectedId === id) {
          const newSelected = next[0].id
          setSelectedId(newSelected)
          saveSelectedId(newSelected)
          setScreen('power')
        }
        toast(null, {
          description: `Device "${prev.find(d => d.id === id)?.name ?? 'Unknown'}" deleted.`,
          variant: 'success',
          timeout: 1500,
        })
        return next
      })
    },
    [selectedId],
  )

  // Still loading
  if (screen === null) return null

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
        <Toast.Provider maxVisibleToasts={1} className='mb-safe'>
          {({ toast }) => {
            return (
              <Toast
                toast={toast}
                variant={toast.content.variant}
                className='rounded-xl bg-bg dark:bg-foreground shadow-md border border-border'
              >
                {toast.content.isLoading ? (
                  <Spinner size='sm' color='current' />
                ) : (
                  <Toast.Indicator variant={toast.content.variant} />
                )}
                <Toast.Content>
                  <Toast.Title>{toast.content.title}</Toast.Title>
                  <Toast.Description>{toast.content.description}</Toast.Description>
                </Toast.Content>
              </Toast>
            )
          }}
        </Toast.Provider>
        <PowerScreen
          device={selectedDevice}
          devices={devices}
          selectedId={selectedId}
          onSelect={handleSelectDevice}
          onReorder={handleReorderDevices}
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
