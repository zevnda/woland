import { useCallback, useRef, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { Device } from '../lib/types'
import DeviceSwitcher from './DeviceSwitcher'
import { toast } from '@heroui/react'
import { FaCheck, FaPowerOff } from 'react-icons/fa6'
import NetworkInfo from './NetworkInfo'
import { darken, transparentize } from 'color2k'
import { ThemeSwitch } from './ThemeSwitch'

export default function PowerScreen({
  device,
  devices,
  selectedId,
  onSelect,
  onReorder,
  onAdd,
  onEdit,
  onDelete,
}: {
  device: Device
  devices: Device[]
  selectedId: string | null
  onSelect: (id: string) => void
  onReorder: (devices: Device[]) => void
  onAdd: () => void
  onEdit: (device: Device) => void
  onDelete: (id: string) => void
}) {
  const [showCheck, setShowCheck] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSendWOL = useCallback(async () => {
    try {
      await invoke<string>('send_wake_on_lan', {
        mac: device.mac,
        broadcastAddr: device.ip,
        port: device.port,
      })
      toast(null, {
        description: 'Wake packet sent!',
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
    <main className='w-full h-dvh flex flex-col bg-bg'>
      {/* Hero */}
      <div
        className='relative overflow-hidden'
        style={{
          background: `linear-gradient(135deg, ${darken(device.color, 0.15)} 0%, ${device.color} 50%, ${transparentize(device.color, 0.3)} 100%)`,
        }}
      >
        {/* Decorative circles */}
        <div className='absolute -top-12 -right-12 w-48 h-48 bg-white dark:bg-black rounded-full opacity-10 pointer-events-none' />
        <div className='absolute -bottom-6 -left-10 w-36 h-36 bg-white dark:bg-black rounded-full opacity-10 pointer-events-none' />
        <div className='absolute top-8 -left-6 w-24 h-24 bg-white dark:bg-black rounded-full opacity-6 pointer-events-none' />

        <div className='flex flex-col items-center pt-20 pb-10 relative z-10'>
          {/* Outer glow ring */}
          <div className='absolute w-40 h-40 bg-white dark:bg-black rounded-full opacity-20 blur-xl pointer-events-none' />

          {/* Button ring */}
          <div className='rounded-full p-2 mb-0 bg-[#ffffff26] dark:bg-[#00000026]'>
            <button
              className='w-32 h-32 rounded-full bg-bg dark:bg-[#1b1b1b] flex items-center justify-center border-[6px] border-white/25 dark:border-black/25 transition-transform duration-75 active:scale-95 active:opacity-80 shadow-lg shadow-black/20'
              onClick={() => {
                if (timerRef.current) clearTimeout(timerRef.current)
                setShowCheck(true)
                timerRef.current = setTimeout(() => setShowCheck(false), 1500)
                handleSendWOL()
              }}
            >
              <div className='relative flex items-center justify-center w-full h-full'>
                <FaPowerOff
                  className={`text-7xl absolute transition-all duration-300 ${showCheck ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}
                  style={{ color: device.color }}
                />
                <FaCheck
                  className={`text-success text-6xl absolute transition-all duration-300 ${showCheck ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                />
              </div>
            </button>
          </div>

          <p
            className='mt-5 text-sm font-medium tracking-widest uppercase opacity-80'
            style={{ color: 'white' }}
          >
            Tap to wake
          </p>
        </div>

        {/* Theme Switch */}
        <div className='absolute bottom-11 left-1/2 -translate-x-1/2 z-30'>
          <ThemeSwitch />
        </div>

        {/* SVG wave swoosh */}
        <svg
          viewBox='0 0 390 60'
          xmlns='http://www.w3.org/2000/svg'
          className='w-full block relative z-10'
          style={{ display: 'block', marginBottom: -1 }}
          preserveAspectRatio='none'
        >
          <path d='M0,10 C80,70 310,10 390,60 L390,60 L0,60 Z' fill='rgba(255,255,255,0.15)' />
          <path d='M0,0 C80,60 310,0 390,50 L390,60 L0,60 Z' className='fill-bg' />
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
          onReorder={onReorder}
        />

        {/* Network info */}
        <NetworkInfo device={device} />
      </div>
    </main>
  )
}
