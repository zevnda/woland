import { useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { Device } from '../lib/types'
import DeviceSwitcher from './DeviceSwitcher'
import { toast } from '@heroui/react'
import { FaPowerOff } from 'react-icons/fa6'
import NetworkInfo from './NetworkInfo'

export default function PowerScreen({
  device,
  devices,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}: {
  device: Device
  devices: Device[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
  onEdit: (device: Device) => void
  onDelete: (id: string) => void
}) {
  const handleSendWOL = useCallback(async () => {
    try {
      await invoke<string>('send_wake_on_lan', {
        mac: device.mac,
        broadcastAddr: device.ip,
        port: device.port,
      })
      toast(null, { description: 'Wake packet sent successfully!', variant: 'success' })
    } catch (error) {
      console.error(error)
      toast(null, {
        description: 'Failed to send wake packet. Please check your device settings and try again.',
        variant: 'danger',
      })
    }
  }, [device])

  return (
    <main className='w-full h-dvh flex flex-col bg-[#fafafa]'>
      {/* Hero */}
      <div className='relative' style={{ background: device.color }}>
        <div className='flex flex-col items-center pt-14 pb-10'>
          <button
            className='w-34 h-34 rounded-full bg-white flex items-center justify-center border-[6px] border-white/25 transition-transform duration-75 active:scale-95 active:opacity-80'
            onClick={handleSendWOL}
          >
            <FaPowerOff className='text-8xl' style={{ color: device.color }} />
          </button>
        </div>

        {/* SVG wave swoosh */}
        <svg
          viewBox='0 0 390 60'
          xmlns='http://www.w3.org/2000/svg'
          className='w-full block'
          style={{ display: 'block', marginBottom: -1 }}
          preserveAspectRatio='none'
        >
          <path d='M0,0 C80,60 310,0 390,50 L390,60 L0,60 Z' fill='#fafafa' />
        </svg>
      </div>

      <div className='flex flex-col gap-4 px-5 pt-2 pb-7'>
        {/* Device switcher */}
        <DeviceSwitcher
          device={device}
          devices={devices}
          selectedId={selectedId}
          onAdd={onAdd}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        {/* Network info */}
        <NetworkInfo device={device} />
      </div>
    </main>
  )
}
