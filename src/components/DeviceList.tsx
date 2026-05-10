import type { Device } from '../lib/types'

export default function DeviceList({
  devices,
  selectedId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}: {
  devices: Device[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
  onEdit: (device: Device) => void
  onDelete: (id: string) => void
}) {
  return (
    <main className='w-full h-dvh flex flex-col p-5 overflow-y-auto bg-[#0c0c0f] text-zinc-200'>
      <div className='flex items-center justify-between mb-5'>
        <h1 className='text-xl font-semibold text-white m-0'>Devices</h1>
      </div>

      {devices.length === 0 ? (
        <div className='flex-1 flex flex-col items-center justify-center gap-1'>
          <p className='text-zinc-500 text-base m-0'>No devices yet</p>
          <p className='text-zinc-700 text-sm m-0'>Add a device to get started</p>
        </div>
      ) : (
        <div className='flex flex-col gap-2 flex-1 overflow-y-auto pb-3'>
          {devices.map(device => (
            <div
              key={device.id}
              className={`tap-none flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900 cursor-pointer transition-colors duration-100 border-[1.5px] active:bg-zinc-800 ${
                device.id === selectedId ? 'border-zinc-700' : 'border-transparent'
              }`}
              onClick={() => onSelect(device.id)}
            >
              <div
                className='w-2.5 h-2.5 rounded-full shrink-0'
                style={{ background: device.color }}
              />

              <div className='flex-1 min-w-0'>
                <div className='text-[0.95rem] font-medium text-white truncate'>{device.name}</div>
                <div className='text-xs text-zinc-500 font-mono mt-0.5'>{device.mac}</div>
              </div>

              <div className='flex items-center gap-0.5 shrink-0'>
                <button
                  className='bg-transparent border-none text-zinc-500 cursor-pointer p-1.5 rounded-lg flex items-center justify-center active:bg-zinc-800'
                  title='Edit'
                  onClick={e => {
                    e.stopPropagation()
                    onEdit(device)
                  }}
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
                    <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
                  </svg>
                </button>
                <button
                  className='bg-transparent border-none text-zinc-500 cursor-pointer p-1.5 rounded-lg flex items-center justify-center active:text-red-500 active:bg-red-500/10'
                  title='Delete'
                  onClick={e => {
                    e.stopPropagation()
                    onDelete(device.id)
                  }}
                >
                  <svg
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polyline points='3 6 5 6 21 6' />
                    <path d='M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6' />
                    <path d='M10 11v6' />
                    <path d='M14 11v6' />
                    <path d='M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className='shrink-0 mt-3 w-full py-3.5 border-none rounded-xl bg-white text-[#0c0c0f] text-[0.95rem] font-semibold cursor-pointer transition-opacity duration-100 active:opacity-80'
        onClick={onAdd}
      >
        Add Device
      </button>
    </main>
  )
}
