import { useState, useCallback } from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { Device } from '../lib/types'
import BackButton from './BackButton'

export default function PowerScreen({ device, onBack }: { device: Device; onBack: () => void }) {
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  const handleSendWOL = useCallback(async () => {
    try {
      const broadcastAddr = device.ip.includes(':') ? device.ip : `${device.ip}:9`
      await invoke<string>('send_wake_on_lan', {
        mac: device.mac,
        broadcastAddr,
      })
      setStatus('sent')
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
    setTimeout(() => setStatus('idle'), 2000)
  }, [device])

  return (
    <main className='w-full h-dvh py-10 flex flex-col p-5 bg-[#0c0c0f] text-zinc-200'>
      <BackButton label='Devices' onClick={onBack} />

      {/* Device info card */}
      <div className='flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900'>
        <div className='w-2.5 h-2.5 rounded-full shrink-0' style={{ background: device.color }} />
        <div>
          <div className='text-base font-semibold text-white'>{device.name}</div>
          <div className='text-xs text-zinc-500 font-mono mt-px'>{device.mac}</div>
          <div className='text-xs text-zinc-500 font-mono mt-px'>{device.ip}</div>
        </div>
      </div>

      {/* Power button */}
      <div className='flex-1 flex items-center justify-center'>
        <div
          className='tap-none w-40 h-40 rounded-full text-white cursor-pointer flex items-center justify-center select-none transition-[transform,opacity] duration-75 ease-in-out active:scale-92 active:opacity-85'
          style={{ background: device.color }}
          onClick={handleSendWOL}
          title='Send Wake-on-LAN packet'
        >
          <svg
            className='w-[90px] h-[90px]'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M18.36 6.64a9 9 0 1 1-12.73 0' />
            <line x1='12' y1='2' x2='12' y2='12' />
          </svg>
        </div>
      </div>

      {/* Status text */}
      <div
        className={`text-center text-sm text-zinc-500 h-6 pb-2 transition-opacity duration-200 ${
          status !== 'idle' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {status === 'sent' && 'Packet sent'}
        {status === 'error' && 'Failed to send'}
      </div>
    </main>
  )
}
