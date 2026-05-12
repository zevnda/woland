import { IoArrowBack } from 'react-icons/io5'

export default function BackButton({
  label,
  button,
  onCancel,
}: {
  label: string
  button?: React.ReactNode
  onCancel: () => void
}) {
  return (
    <div className='self-start mb-4 inline-flex items-center justify-between w-full gap-1 bg-transparent border-none font-bold cursor-pointer p-0 active:text-white'>
      <IoArrowBack size={26} className='text-blue-400' onClick={onCancel} />
      <p className='text-lg text-black dark:text-white absolute left-1/2 -translate-x-1/2'>
        {label}
      </p>
      {button}
    </div>
  )
}
