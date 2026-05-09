export default function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      className='self-start mb-4 inline-flex items-center gap-1 bg-transparent border-none text-zinc-400 text-sm cursor-pointer p-0 active:text-white'
      onClick={onClick}
    >
      <svg
        width='16'
        height='16'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <polyline points='15 18 9 12 15 6' />
      </svg>
      {label}
    </button>
  )
}
