import { Button } from '@heroui/react'
import { useTheme } from 'next-themes'
import { useEffect } from 'react'
import { LuMoonStar, LuSun } from 'react-icons/lu'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    try {
      const bridge = (window as any).NavBarBridge
      if (bridge) {
        bridge.setColor(theme === 'dark' ? '#161717' : '#fafafa', theme !== 'dark')
      }
    } catch (e) {
      console.warn('Failed to set nav bar color:', e)
    }
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    try {
      const bridge = (window as any).NavBarBridge
      if (bridge) {
        bridge.setColor(newTheme === 'dark' ? '#161717' : '#fafafa', newTheme !== 'dark')
      }
    } catch (e) {
      console.warn('Failed to set nav bar color:', e)
    }
  }

  return (
    <Button isIconOnly variant='tertiary' className='bg-bg/10 text-white' onClick={toggleTheme}>
      {' '}
      {theme === 'dark' ? <LuSun /> : <LuMoonStar />}{' '}
    </Button>
  )
}
