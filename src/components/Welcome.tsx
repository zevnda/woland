import { FaPowerOff } from 'react-icons/fa6'
import { LuPlus, LuWifi, LuMonitor, LuSmartphone, LuUpload } from 'react-icons/lu'
import { ThemeSwitch } from './ThemeSwitch'

export default function Welcome({ onAdd, onImport }: { onAdd: () => void; onImport: () => void }) {
  return (
    <main className='w-full h-dvh flex flex-col bg-bg'>
      {/* Hero */}
      <div
        className='relative overflow-hidden'
        style={{
          background: 'linear-gradient(135deg, #1a5bc4 0%, #2373ea 50%, rgba(35,115,234,0.7) 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className='absolute -top-12 -right-12 w-48 h-48 bg-white dark:bg-black rounded-full opacity-10 pointer-events-none' />
        <div className='absolute -bottom-6 -left-10 w-36 h-36 bg-white dark:bg-black rounded-full opacity-10 pointer-events-none' />
        <div className='absolute top-8 -left-6 w-24 h-24 bg-white dark:bg-black rounded-full opacity-6 pointer-events-none' />

        <div className='flex flex-col items-center pt-24 pb-14 relative z-10'>
          {/* Outer glow ring */}
          <div className='absolute w-40 h-40 bg-white dark:bg-black rounded-full opacity-20 blur-xl pointer-events-none' />

          {/* Icon cluster */}
          <div className='relative mb-6'>
            <div className='rounded-full p-2 bg-[#ffffff26] dark:bg-[#00000026]'>
              <div className='w-28 h-28 rounded-full bg-bg dark:bg-[#1b1b1b] flex items-center justify-center border-[6px] border-white/25 dark:border-black/25 shadow-lg shadow-black/20'>
                <FaPowerOff className='text-6xl text-[#2373ea]' />
              </div>
            </div>
            {/* Floating device icons */}
            <div className='absolute -top-2 -right-3 w-9 h-9 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center'>
              <LuMonitor className='text-white/90' size={16} />
            </div>
            <div className='absolute -bottom-1 -left-4 w-8 h-8 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center'>
              <LuSmartphone className='text-white/90' size={14} />
            </div>
            <div className='absolute top-1/2 -translate-y-1/2 -right-8 w-7 h-7 rounded-full bg-white/15 dark:bg-black/15 backdrop-blur-sm flex items-center justify-center'>
              <LuWifi className='text-white/80' size={12} />
            </div>
          </div>

          <h1 className='text-2xl font-bold text-white tracking-tight'>Welcome to WoLAnd</h1>
          <p className='mt-1.5 text-sm text-white/70 font-medium text-center uppercase'>
            Wake your devices with a single tap
          </p>
        </div>

        {/* Theme Switch */}
        <div className='absolute bottom-13 left-1/2 -translate-x-1/2 z-30'>
          <ThemeSwitch />
        </div>

        {/* SVG wave swoosh */}
        <svg
          viewBox='0 0 390 60'
          xmlns='http://www.w3.org/2000/svg'
          className='w-full block relative z-10'
          style={{ display: 'block', marginBottom: -1 }}
          preserveAspectRatio='none'
        >
          <path d='M0,10 C80,70 310,10 390,60 L390,60 L0,60 Z' fill='rgba(255,255,255,0.15)' />
          <path d='M0,0 C80,60 310,0 390,50 L390,60 L0,60 Z' className='fill-bg' />
        </svg>
      </div>

      {/* Content */}
      <div className='flex-1 flex flex-col items-center px-6 pt-8'>
        <div className='flex flex-col items-center text-center gap-2 mb-8'>
          <p className='text-lg font-semibold text-black dark:text-white'>Get Started</p>
          <p className='text-sm text-alt leading-relaxed max-w-70'>
            You can add any device that supports WoL such as computers, TVs, servers, and more.
          </p>
        </div>

        <div className='flex flex-col gap-3 w-full'>
          <button
            onClick={onAdd}
            className='group flex items-center gap-3 w-full max-w-xs px-5 py-4 rounded-2xl bg-[#2373ea] shadow-md'
          >
            <div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0'>
              <LuPlus className='text-white' size={20} />
            </div>
            <div className='text-left'>
              <p className='text-white font-semibold text-[0.95rem]'>Add a Device</p>
            </div>
          </button>

          <button
            onClick={onImport}
            className='group flex items-center gap-3 w-full max-w-xs px-5 py-4 rounded-2xl bg-bg dark:bg-foreground border border-border shadow-md'
          >
            <div className='w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0'>
              <LuUpload className='text-alt' size={20} />
            </div>
            <div className='text-left'>
              <p className='text-black dark:text-white font-semibold text-[0.95rem]'>
                Import Device List
              </p>
            </div>
          </button>
        </div>
      </div>
    </main>
  )
}
