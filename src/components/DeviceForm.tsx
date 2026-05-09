import { useState } from 'react'
import type { Device } from '../lib/types'
import { COLORS } from '../lib/types'
import BackButton from './BackButton'

export default function DeviceForm({
  device,
  onSave,
  onCancel,
}: {
  device: Device | null
  onSave: (device: Device) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(device?.name || '')
  const [mac, setMac] = useState(device?.mac || '')
  const [ip, setIp] = useState(device?.ip || '')
  const [color, setColor] = useState(device?.color || COLORS[0])

  const isEditing = !!device
  const isValid = name.trim() && mac.trim() && ip.trim()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    onSave({
      id: device?.id || crypto.randomUUID(),
      name: name.trim(),
      mac: mac.trim(),
      ip: ip.trim(),
      color,
    })
  }

  return (
    <main className='w-full h-dvh py-10 flex flex-col p-5 overflow-y-auto bg-[#0c0c0f] text-zinc-200'>
      <BackButton label='Back' onClick={onCancel} />

      <h1 className='text-xl font-semibold text-white m-0 mb-6'>
        {isEditing ? 'Edit Device' : 'Add Device'}
      </h1>

      <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
        <label className='flex flex-col gap-1.5'>
          <span className='text-xs font-medium text-zinc-400 uppercase tracking-wide'>Name</span>
          <input
            className='w-full py-3 px-3.5 rounded-[10px] border-[1.5px] border-zinc-800 bg-zinc-900 text-white text-[0.95rem] outline-none transition-colors duration-150 placeholder:text-zinc-700 focus:border-zinc-600 font-[inherit]'
            type='text'
            placeholder='e.g. Gaming PC'
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </label>

        <label className='flex flex-col gap-1.5'>
          <span className='text-xs font-medium text-zinc-400 uppercase tracking-wide'>
            MAC Address
          </span>
          <input
            className='w-full py-3 px-3.5 rounded-[10px] border-[1.5px] border-zinc-800 bg-zinc-900 text-white text-[0.95rem] outline-none transition-colors duration-150 placeholder:text-zinc-700 focus:border-zinc-600 font-[inherit]'
            type='text'
            placeholder='e.g. AA:BB:CC:DD:EE:FF'
            value={mac}
            onChange={e => setMac(e.target.value)}
          />
        </label>

        <label className='flex flex-col gap-1.5'>
          <span className='text-xs font-medium text-zinc-400 uppercase tracking-wide'>
            Broadcast IP
          </span>
          <input
            className='w-full py-3 px-3.5 rounded-[10px] border-[1.5px] border-zinc-800 bg-zinc-900 text-white text-[0.95rem] outline-none transition-colors duration-150 placeholder:text-zinc-700 focus:border-zinc-600 font-[inherit]'
            type='text'
            placeholder='e.g. 192.168.1.255'
            value={ip}
            onChange={e => setIp(e.target.value)}
          />
        </label>

        <div className='flex flex-col gap-1.5'>
          <span className='text-xs font-medium text-zinc-400 uppercase tracking-wide'>Color</span>
          <div className='flex gap-2.5 flex-wrap'>
            {COLORS.map(c => (
              <button
                key={c}
                type='button'
                className={`w-8 h-8 rounded-full border-[2.5px] cursor-pointer p-0 transition-all duration-100 ${
                  c === color ? 'border-white scale-115' : 'border-transparent active:scale-90'
                }`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        <button
          className='w-full py-3.5 border-none rounded-xl bg-white text-[#0c0c0f] text-[0.95rem] font-semibold cursor-pointer transition-opacity duration-100 disabled:opacity-30 disabled:cursor-default active:enabled:opacity-80'
          type='submit'
          disabled={!isValid}
        >
          {isEditing ? 'Save Changes' : 'Add Device'}
        </button>
      </form>
    </main>
  )
}
