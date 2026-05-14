import { useEffect } from 'react'
import { Button, Drawer, useOverlayState } from '@heroui/react'
import { Device, ICON_MAP } from '../lib/types'
import { IoAdd } from 'react-icons/io5'
import { FaCaretDown, FaRegEdit, FaRegTrashAlt } from 'react-icons/fa'
import { LuDownload, LuUpload } from 'react-icons/lu'
import { MdDragIndicator } from 'react-icons/md'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers'

function SortableDevice({
  device,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onClose,
}: {
  device: Device
  selectedId: string | null
  onSelect: (id: string) => void
  onEdit: (device: Device) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: device.id,
  })

  const Icon = ICON_MAP[device.icon as keyof typeof ICON_MAP] ?? ICON_MAP['MdMonitor']

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
        position: 'relative',
      }}
      className={`flex items-start gap-3 p-3.5 rounded-xl bg-bg dark:bg-foreground border-[1.5px] ${
        isDragging
          ? 'opacity-80 shadow-lg border-black/30 dark:border-white/30'
          : device.id === selectedId
            ? 'border-accent'
            : 'border-border'
      }`}
      onClick={() => {
        if (!isDragging) {
          onSelect(device.id)
          onClose()
        }
      }}
    >
      <Icon size={20} color={device.color} />

      <div className='flex-1 min-w-0'>
        <div className='text-[0.95rem] font-medium text-black dark:text-white truncate'>
          {device.name}
        </div>
        <div className='text-xs text-alt font-mono mt uppercase'>{device.mac}</div>
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
          <FaRegEdit className='text-alt' />
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

        <div
          {...attributes}
          {...listeners}
          className='touch-none shrink-0 cursor-grab active:cursor-grabbing p-1 -ml-1'
          onClick={e => e.stopPropagation()}
        >
          <MdDragIndicator size={22} className='text-alt' />
        </div>
      </div>
    </div>
  )
}

export default function DeviceSwitcher({
  device,
  devices,
  selectedId,
  onAdd,
  onSelect,
  onEdit,
  onDelete,
  onReorder,
  onExport,
  onImport,
}: {
  device: Device
  devices: Device[]
  selectedId: string | null
  onAdd: () => void
  onSelect: (id: string) => void
  onEdit: (device: Device) => void
  onDelete: (id: string) => void
  onReorder: (devices: Device[]) => void
  onExport: () => void
  onImport: () => void
}) {
  const state = useOverlayState()

  const Icon = ICON_MAP[device.icon as keyof typeof ICON_MAP] ?? ICON_MAP['MdMonitor']

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  )

  useEffect(() => {
    function handleBack(e: Event) {
      if (state.isOpen) {
        e.preventDefault()
        state.close()
      }
    }
    window.addEventListener('android-back', handleBack)
    return () => window.removeEventListener('android-back', handleBack)
  }, [state.isOpen, state.close])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = devices.findIndex(d => d.id === active.id)
    const newIndex = devices.findIndex(d => d.id === over.id)
    onReorder(arrayMove(devices, oldIndex, newIndex))
  }

  return (
    <div>
      <Drawer>
        <div
          className='flex items-center gap-3 w-full p-3.5 rounded-xl bg-bg dark:bg-foreground shadow-md border border-border active:scale-[0.98] transition-transform duration-100'
          onClick={() => state.open()}
        >
          <div className='flex justify-between w-full items-center'>
            <div>
              <p className='text-alt font-semibold text-sm'>Selected Device</p>
              <div className='flex items-center gap-1.5'>
                <Icon size={20} color={device.color} className='inline-block' />
                <p className='font-bold leading-4.5'>{device.name}</p>
              </div>
            </div>
            <FaCaretDown size={28} />
          </div>
        </div>

        <Drawer.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
          <Drawer.Content placement='bottom'>
            <Drawer.Dialog className='max-h-[72%]'>
              <Drawer.Header>
                <Drawer.Heading>
                  <div>
                    <p className='text-black dark:text-white'>Select A Device</p>
                    <p className='text-alt text-xs'>
                      Drag devices to order them for widget display before adding the widget to your
                      home screen.
                    </p>
                  </div>
                </Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={devices.map(d => d.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className='flex flex-col gap-2 overflow-scroll'>
                      {devices.map(d => (
                        <SortableDevice
                          key={d.id}
                          device={d}
                          selectedId={selectedId}
                          onSelect={onSelect}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          onClose={state.close}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </Drawer.Body>
              <Drawer.Footer className='mb-safe'>
                <Button
                  variant='ghost'
                  className='flex-1 text-alt'
                  onClick={() => {
                    state.close()
                    onExport()
                  }}
                >
                  <LuDownload size={16} />
                  Export
                </Button>
                <Button
                  variant='ghost'
                  className='flex-1 text-alt'
                  onClick={() => {
                    state.close()
                    onImport()
                  }}
                >
                  <LuUpload size={16} />
                  Import
                </Button>
                <Button variant='secondary' className='text-black dark:text-white' onClick={onAdd}>
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
