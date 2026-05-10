import { Button, Drawer, useOverlayState } from '@heroui/react'
import { Device, ICON_MAP } from '../lib/types'
import { IoAdd } from 'react-icons/io5'
import { FaCaretDown, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'

export default function DeviceSwitcher({
  device,
  devices,
  selectedId,
  onAdd,
  onSelect,
  onEdit,
  onDelete,
}: {
  device: Device
  devices: Device[]
  selectedId: string | null
  onAdd: () => void
  onSelect: (id: string) => void
  onEdit: (device: Device) => void
  onDelete: (id: string) => void
}) {
  const state = useOverlayState()

  const Icon = ICON_MAP[device.icon as keyof typeof ICON_MAP] ?? ICON_MAP['LuMonitor']

  return (
    <div>
      <Drawer>
        <div
          className='flex items-center gap-3 w-full p-3.5 rounded-xl bg-[#fafafa] shadow shadow-black/20 active:bg-[#f7f7f7] active:scale-[0.98] transition-transform duration-100'
          onClick={() => state.open()}
        >
          <div className='flex justify-between w-full items-center'>
            <div>
              <p className='text-zinc-500 font-semibold text-sm'>Selected Device</p>
              <div className='flex items-center gap-1'>
                <Icon size={20} color={device.color} className='inline-block' />
                <p className='text-zinc-800 font-bold leading-4.5'>{device.name}</p>
              </div>
            </div>
            <FaCaretDown size={28} />
          </div>
        </div>
        <Drawer.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
          <Drawer.Content placement='bottom'>
            <Drawer.Dialog>
              <Drawer.Header>
                <Drawer.Heading>Devices</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                <div className='flex flex-col gap-2'>
                  {devices.map(device => {
                    const Icon =
                      ICON_MAP[device.icon as keyof typeof ICON_MAP] ?? ICON_MAP['LuMonitor']
                    return (
                      <div
                        key={device.id}
                        className={`tap-none flex items-start gap-3 p-3.5 rounded-xl bg-[#fafafa] shadow transition-colors duration-100 border-[1.5px] active:bg-[#f7f7f7] ${
                          device.id === selectedId ? 'border-zinc-200' : 'border-transparent'
                        }`}
                        onClick={() => {
                          onSelect(device.id)
                          state.close()
                        }}
                      >
                        <Icon size={20} color={device.color} />

                        <div className='flex-1 min-w-0'>
                          <div className='text-[0.95rem] font-medium text-black truncate'>
                            {device.name}
                          </div>
                          <div className='text-xs text-zinc-500 font-mono mt-0.5 uppercase'>
                            {device.mac}
                          </div>
                        </div>

                        <div className='flex items-center gap-0.5 shrink-0'>
                          <Button
                            isIconOnly
                            variant='ghost'
                            onClick={e => {
                              e.stopPropagation()
                              onEdit(device)
                            }}
                          >
                            <FaRegEdit className='text-zinc-600' />
                          </Button>

                          <Button
                            isIconOnly
                            variant='ghost'
                            onClick={e => {
                              e.stopPropagation()
                              onDelete(device.id)
                            }}
                          >
                            <FaRegTrashAlt className='text-danger' />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Drawer.Body>
              <Drawer.Footer style={{ marginBottom: 'env(safe-area-inset-bottom)' }}>
                <Button slot='close' variant='secondary'>
                  Close
                </Button>
                <Button variant='primary' onClick={onAdd}>
                  <IoAdd />
                  Add Device
                </Button>
              </Drawer.Footer>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </div>
  )
}
