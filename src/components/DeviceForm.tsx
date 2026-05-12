import { FormEvent, useEffect, useState } from 'react'
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
  const [ip4, setIp4] = useState(device?.ip4 || '')
  const [port, setPort] = useState(device?.port || '9')
  const [color, setColor] = useState(device?.color || COLORS[0])
  const [icon, setIcon] = useState(device?.icon || ICONS[0])
  const [touched, setTouched] = useState({
    name: false,
    mac: false,
    ip: false,
    ip4: true,
    port: false,
  })

  const isEditing = !!device

  const isMacValid = MAC_REGEX.test(mac.trim())
  const isIpValid = IP_REGEX.test(ip.trim())
  const isPortValid = Number(port) >= 1 && Number(port) <= 65535
  const isNameValid = name.trim().length > 0
  const isValid = isNameValid && isMacValid && isIpValid && isPortValid

  useEffect(() => {
    function handleBack(e: Event) {
      e.preventDefault()
      onCancel()
    }
    window.addEventListener('android-back', handleBack)
    return () => window.removeEventListener('android-back', handleBack)
  }, [isEditing, devices.length, onCancel])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched({ name: true, mac: true, ip: true, ip4: true, port: true })
    if (!isValid) return

    invoke<NetworkInfo>('get_network_info')
      .then(info => {
        onSave({
          id: device?.id || crypto.randomUUID(),
          name: name.trim(),
          mac: mac.trim(),
          ip: ip.trim(),
          ip4: ip4.trim() || undefined,
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
          ip4: ip4.trim() || undefined,
          port: port.trim(),
          color,
          icon,
          addedAt: new Date().toISOString(),
        })
      })
  }

  function formatMac(e: React.ChangeEvent<HTMLInputElement>) {
    const isDeleting = e.target.value.length < mac.length
    const clean = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 12)

    let formatted = ''
    for (let i = 0; i < clean.length; i++) {
      if (i > 0 && i % 2 === 0) formatted += ':'
      formatted += clean[i]
    }

    if (!isDeleting && clean.length > 0 && clean.length % 2 === 0 && clean.length < 12) {
      formatted += ':'
    }

    setMac(formatted)
  }

  function formatIp(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    const parts = raw.split('.')
    const isDeleting = e.target.value.length < ip.length

    const clamped = parts.slice(0, 4).map(part => {
      const sliced = part.slice(0, 3)
      const num = parseInt(sliced, 10)
      if (!isNaN(num) && num > 255) return '255'
      return sliced
    })

    const formatted = clamped.join('.')

    const lastPart = clamped[clamped.length - 1]
    if (!isDeleting && lastPart?.length === 3 && clamped.length < 4 && !formatted.endsWith('.')) {
      setIp(formatted + '.')
    } else {
      setIp(formatted)
    }
  }

  function formatIp4(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    const parts = raw.split('.')
    const isDeleting = e.target.value.length < ip4.length

    const clamped = parts.slice(0, 4).map(part => {
      const sliced = part.slice(0, 3)
      const num = parseInt(sliced, 10)
      if (!isNaN(num) && num > 255) return '255'
      return sliced
    })

    const formatted = clamped.join('.')

    const lastPart = clamped[clamped.length - 1]
    if (!isDeleting && lastPart?.length === 3 && clamped.length < 4 && !formatted.endsWith('.')) {
      setIp4(formatted + '.')
    } else {
      setIp4(formatted)
    }
  }

  function handlePortChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    if (raw === '') return setPort('')
    const num = parseInt(raw, 10)
    if (num > 65535) return setPort('65535')
    setPort(String(num))
  }

  const inputClass =
    'w-full py-3 px-3.5 rounded-[10px] border-[1.5px] text-[0.95rem] outline-none transition-colors duration-150 placeholder:text-alt dark:placeholder:text-alt focus:border-border font-[inherit] dark:bg-foreground dark:text-white'
  const errorClass = 'text-xs text-danger mt-0.5'

  return (
    <main className='w-full h-dvh pb-safe flex flex-col bg-bg box-border'>
      <div className='w-full h-7.5 bg-status' />

      <div className='px-5 pt-3 shrink-0'>
        <BackButton label={isEditing ? 'Edit Device' : 'Add Device'} onClick={onCancel} />
      </div>

      <div
        className='flex-1 overflow-y-auto px-5 pb-5 scroll-container'
        style={{ paddingBottom: `calc(1.25rem + var(--keyboard-height))` }}
      >
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <label className='flex flex-col gap-1.5'>
            <span className='text-xs font-medium text-black dark:text-white uppercase tracking-wide'>
              Name
            </span>
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
            <span className='text-xs font-medium text-black dark:text-white uppercase tracking-wide'>
              MAC Address
            </span>
            <input
              className={`${inputClass} uppercase`}
              type='text'
              placeholder='AA:BB:CC:DD:EE:FF'
              value={mac}
              onChange={formatMac}
              onBlur={() => setTouched(t => ({ ...t, mac: true }))}
            />
            {touched.mac && !isMacValid && (
              <span className={errorClass}>Invalid MAC address (e.g. AA:BB:CC:DD:EE:FF)</span>
            )}
          </label>

          <div className='flex gap-3'>
            <label className='flex flex-col gap-1.5 flex-1'>
              <span className='text-xs font-medium text-black dark:text-white uppercase tracking-wide'>
                Broadcast IP
              </span>
              <input
                className={inputClass}
                type='text'
                inputMode='decimal'
                placeholder='192.168.1.255'
                value={ip}
                onChange={formatIp}
                onBlur={() => setTouched(t => ({ ...t, ip: true }))}
              />
              {touched.ip && !isIpValid && <span className={errorClass}>Invalid IP address</span>}
            </label>

            <label className='flex flex-col gap-1.5 w-20'>
              <span className='text-xs font-medium text-black dark:text-white uppercase tracking-wide'>
                Port
              </span>
              <input
                className={inputClass}
                type='text'
                inputMode='numeric'
                placeholder='9'
                value={port}
                onChange={handlePortChange}
                onBlur={() => setTouched(t => ({ ...t, port: true }))}
              />
              {touched.port && !isPortValid && <span className={errorClass}>1–65535</span>}
            </label>
          </div>

          <label className='flex flex-col gap-1.5'>
            <span className='text-xs font-medium text-black dark:text-white uppercase tracking-wide'>
              Device IPv4 (optional)
            </span>
            <span className='text-xs text-alt'>
              Allows WoLAnd to check the device status after waking it up
            </span>
            <input
              className={`${inputClass} uppercase`}
              type='text'
              inputMode='decimal'
              placeholder='192.168.1.100'
              value={ip4}
              onChange={formatIp4}
              onBlur={() => setTouched(t => ({ ...t, ip4: true }))}
            />
          </label>

          <div className='flex flex-col gap-2'>
            <span className='text-xs font-medium text-black dark:text-white uppercase tracking-wide'>
              Color
            </span>
            <div className='flex gap-3 flex-wrap py-1'>
              {COLORS.map(c => (
                <button
                  key={c}
                  type='button'
                  className={`w-10 h-10 rounded-full border-[3px] cursor-pointer p-0 transition-all duration-100 ${
                    c === color ? 'border-zinc-600 scale-110' : 'border-transparent active:scale-90'
                  }`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <span className='text-xs font-medium text-black dark:text-white uppercase tracking-wide'>
              Icon
            </span>
            <div className='flex gap-2 overflow-x-auto py-1 -mx-5 px-5'>
              {ICONS.map(i => {
                const Icon = ICON_MAP[i]
                return (
                  <button
                    key={i}
                    type='button'
                    className={`shrink-0 rounded-2xl border-[2.5px] cursor-pointer p-3 transition-all duration-100 ${
                      i === icon
                        ? 'border-zinc-600 scale-105'
                        : 'border-transparent active:scale-90'
                    }`}
                    onClick={() => setIcon(i)}
                  >
                    <Icon size={28} color={i === icon ? color : undefined} />
                  </button>
                )
              })}
            </div>
          </div>

          <Button
            fullWidth
            size='lg'
            type='submit'
            className='mt-4 mb-safe'
            isDisabled={!isValid && Object.values(touched).some(Boolean)}
          >
            {isEditing ? 'Save Changes' : 'Add Device'}
          </Button>
        </form>
      </div>
    </main>
  )
}
