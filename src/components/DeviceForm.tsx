import { FormEvent, useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { Device, NetworkInfo } from '../lib/types'
import { COLORS, ICON_MAP, ICONS } from '../lib/types'
import BackButton from './BackButton'
import { Button } from '@heroui/react'

const MAC_REGEX = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
const IP_REGEX = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/

export default function DeviceForm({
  devices,
  device,
  onSave,
  onCancel,
}: {
  devices: Device[]
  device: Device | null
  onSave: (device: Device) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(device?.name || '')
  const [mac, setMac] = useState(device?.mac || '')
  const [ip, setIp] = useState(device?.ip || '')
  const [port, setPort] = useState(device?.port || '9')
  const [color, setColor] = useState(device?.color || COLORS[0])
  const [icon, setIcon] = useState(device?.icon || ICONS[0])
  const [touched, setTouched] = useState({ name: false, mac: false, ip: false, port: false })

  const isEditing = !!device

  const isMacValid = MAC_REGEX.test(mac.trim())
  const isIpValid = IP_REGEX.test(ip.trim())
  const isPortValid = Number(port) >= 1 && Number(port) <= 65535
  const isNameValid = name.trim().length > 0
  const isValid = isNameValid && isMacValid && isIpValid && isPortValid

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched({ name: true, mac: true, ip: true, port: true })
    if (!isValid) return

    invoke<NetworkInfo>('get_network_info')
      .then(info => {
        onSave({
          id: device?.id || crypto.randomUUID(),
          name: name.trim(),
          mac: mac.trim(),
          ip: ip.trim(),
          port: port.trim(),
          color,
          icon,
          sourceIp: info.source_ip ?? undefined,
          subnetMask: info.subnet_mask ?? undefined,
          gateway: info.gateway ?? undefined,
          interface: info.interface_name ?? undefined,
          addedAt: new Date().toISOString(),
        })
      })
      .catch(() => {
        // Save without network info if collection fails
        onSave({
          id: device?.id || crypto.randomUUID(),
          name: name.trim(),
          mac: mac.trim(),
          ip: ip.trim(),
          port: port.trim(),
          color,
          icon,
          addedAt: new Date().toISOString(),
        })
      })
  }

  const inputClass =
    'w-full py-3 px-3.5 rounded-[10px] border-[1.5px] text-[0.95rem] outline-none transition-colors duration-150 placeholder:text-zinc-700 focus:border-zinc-600 font-[inherit]'
  const errorClass = 'text-xs text-red-500 mt-0.5'

  return (
    <main
      className='w-full flex flex-col bg-[#fafafa]'
      style={{
        height: '100dvh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxSizing: 'border-box',
      }}
    >
      <div className='px-5 pt-5 pb-2 shrink-0'>
        {(isEditing || devices.length > 0) && <BackButton label='Back' onClick={onCancel} />}
        <p className='text-xl font-semibold m-0 mb-0'>{isEditing ? 'Edit Device' : 'Add Device'}</p>
      </div>

      <div className='flex-1 overflow-y-auto px-5 pb-5 scroll-container'>
        <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
          <label className='flex flex-col gap-1.5'>
            <span className='text-xs font-medium text-zinc-700 uppercase tracking-wide'>Name</span>
            <input
              className={inputClass}
              type='text'
              placeholder='Gaming PC'
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, name: true }))}
              autoFocus
            />
            {touched.name && !isNameValid && <span className={errorClass}>Name is required</span>}
          </label>

          <label className='flex flex-col gap-1.5'>
            <span className='text-xs font-medium text-zinc-700 uppercase tracking-wide'>
              MAC Address
            </span>
            <input
              className={`${inputClass} uppercase`}
              type='text'
              placeholder='AA:BB:CC:DD:EE:FF'
              value={mac}
              onChange={e => setMac(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, mac: true }))}
            />
            {touched.mac && !isMacValid && (
              <span className={errorClass}>Invalid MAC address (e.g. AA:BB:CC:DD:EE:FF)</span>
            )}
          </label>

          <label className='flex flex-col gap-1.5'>
            <span className='text-xs font-medium text-zinc-700 uppercase tracking-wide'>
              Broadcast IP
            </span>
            <input
              className={inputClass}
              type='text'
              placeholder='192.168.1.255'
              value={ip}
              onChange={e => setIp(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, ip: true }))}
            />
            {touched.ip && !isIpValid && (
              <span className={errorClass}>Invalid IP address (e.g. 192.168.1.255)</span>
            )}
          </label>

          <label className='flex flex-col gap-1.5'>
            <span className='text-xs font-medium text-zinc-700 uppercase tracking-wide'>Port</span>
            <input
              className={inputClass}
              type='text'
              placeholder='9'
              value={port}
              onChange={e => setPort(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, port: true }))}
            />
            {touched.port && !isPortValid && (
              <span className={errorClass}>
                Port must be between 1 and 65535. Usually 9 is the best option.
              </span>
            )}
          </label>

          <div className='flex flex-col gap-1.5'>
            <span className='text-xs font-medium text-zinc-700 uppercase tracking-wide'>Color</span>
            <div className='flex gap-2.5 flex-wrap'>
              {COLORS.map(c => (
                <button
                  key={c}
                  type='button'
                  className={`w-8 h-8 rounded-full border-[2.5px] cursor-pointer p-0 transition-all duration-100 ${
                    c === color ? 'border-zinc-600 scale-115' : 'border-transparent active:scale-90'
                  }`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <span className='text-xs font-medium text-zinc-700 uppercase tracking-wide'>Icon</span>
            <div className='flex gap-2.5 flex-wrap'>
              {ICONS.map(i => {
                const Icon = ICON_MAP[i]
                return (
                  <button
                    key={i}
                    type='button'
                    className={`rounded-full border-[2.5px] cursor-pointer p-1.5 transition-all duration-100 ${
                      i === icon
                        ? 'border-zinc-600 scale-115'
                        : 'border-transparent active:scale-90'
                    }`}
                    onClick={() => setIcon(i)}
                  >
                    <Icon size={24} color={i === icon ? color : undefined} />
                  </button>
                )
              })}
            </div>
          </div>

          <Button
            fullWidth
            size='lg'
            type='submit'
            className='mt-auto'
            style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
            isDisabled={!isValid && Object.values(touched).some(Boolean)}
          >
            {isEditing ? 'Save Changes' : 'Add Device'}
          </Button>
        </form>
      </div>
    </main>
  )
}
