import { IoArrowBack } from 'react-icons/io5'

export default function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className='self-start mb-4 inline-flex items-center gap-1 bg-transparent border-none text-zinc-400 font-bold cursor-pointer p-0 active:text-white'
      onClick={onClick}
    >
      <IoArrowBack size={26} className='text-blue-400' />
      <p className='ml-4 text-lg'>{label}</p>
    </button>
  )
}
