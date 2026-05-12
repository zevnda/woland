import { LuNetwork } from 'react-icons/lu'
import { Device } from '../lib/types'

export default function NetworkInfo({ device }: { device: Device }) {
  return (
    <div className='flex items-center gap-3 w-full p-3.5 rounded-xl bg-bg dark:bg-foreground shadow-md border border-border'>
      <div className='flex flex-col w-full'>
        <LuNetwork size={28} />
        <div className='grid grid-cols-2 gap-3 mt-3'>
          {[
            { label: 'MAC Address', value: device.mac },
            { label: 'Broadcast IP', value: device.ip },
            { label: 'Device IPv4', value: device.ip4 },
            ...(device.sourceIp ? [{ label: 'Source IP', value: device.sourceIp }] : []),
            ...(device.subnetMask ? [{ label: 'Subnet Mask', value: device.subnetMask }] : []),
            ...(device.gateway ? [{ label: 'Gateway', value: device.gateway }] : []),
            ...(device.interface ? [{ label: 'Interface', value: device.interface }] : []),
            { label: 'Port', value: device.port },
          ].map(({ label, value }) => {
            if (!value) return null
            return (
              <div className='flex flex-col' key={label}>
                <p className='text-black dark:text-white font-semibold text-sm'>{label}</p>
                <p
                  className={`text-alt leading-4.5 text-sm font-mono ${label === 'MAC Address' ? 'uppercase' : ''}`}
                >
                  {value}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
