import { useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { Device } from '../lib/types'
import DeviceSwitcher from './DeviceSwitcher'
import { toast } from '@heroui/react'
import { FaPowerOff } from 'react-icons/fa6'
import NetworkInfo from './NetworkInfo'
import { darken, transparentize } from 'color2k'

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
      toast(null, {
        description: 'Wake packet sent successfully!',
        variant: 'success',
        timeout: 1500,
      })
    } catch (error) {
      console.error(error)
      toast(null, {
        description: 'Failed to send wake packet. Please check your device settings and try again.',
        variant: 'danger',
        timeout: 1500,
      })
    }
  }, [device])

  return (
    <main className='w-full h-dvh flex flex-col bg-[#fafafa]'>
      {/* Hero */}
      <div
        className='relative overflow-hidden'
        style={{
          background: `linear-gradient(135deg, ${darken(device.color, 0.15)} 0%, ${device.color} 50%, ${transparentize(device.color, 0.3)} 100%)`,
        }}
      >
        {/* Decorative circles */}
        <div className='absolute -top-12 -right-12 w-48 h-48 bg-white rounded-full opacity-10 pointer-events-none' />
        <div className='absolute -bottom-6 -left-10 w-36 h-36 bg-white rounded-full opacity-10 pointer-events-none' />
        <div className='absolute top-8 -left-6 w-24 h-24 bg-white rounded-full opacity-6 pointer-events-none' />

        <div className='flex flex-col items-center pt-20 pb-10 relative z-10'>
          {/* Outer glow ring */}
          <div className='absolute w-40 h-40 bg-white rounded-full opacity-20 blur-xl pointer-events-none' />

          {/* Button ring */}
          <div className='rounded-full p-2 mb-0' style={{ background: 'rgba(255,255,255,0.15)' }}>
            <button
              className='w-32 h-32 rounded-full bg-white flex items-center justify-center border-[6px] border-white/25 transition-transform duration-75 active:scale-95 active:opacity-80 shadow-lg shadow-black/20'
              onClick={handleSendWOL}
            >
              <FaPowerOff className='text-7xl' style={{ color: device.color }} />
            </button>
          </div>

          <p
            className='mt-5 text-sm font-medium tracking-widest uppercase opacity-80'
            style={{ color: 'white' }}
          >
            Tap to wake
          </p>
        </div>

        {/* SVG wave swoosh */}
        <svg
          viewBox='0 0 390 60'
          xmlns='http://www.w3.org/2000/svg'
          className='w-full block'
          style={{ display: 'block', marginBottom: -1 }}
          preserveAspectRatio='none'
        >
          <path d='M0,10 C80,70 310,10 390,60 L390,60 L0,60 Z' fill='rgba(255,255,255,0.15)' />
          <path d='M0,0 C80,60 310,0 390,50 L390,60 L0,60 Z' fill='#fafafa' />
        </svg>
      </div>

      <div className='flex flex-col gap-4 px-5 pt-6 pb-7'>
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
