import {
  LuMonitor,
  LuSmartphone,
  LuTablet,
  LuRouter,
  LuPrinter,
  LuTv,
  LuServer,
  LuLaptop,
  LuHardDrive,
  LuCpu,
  LuGamepad2,
  LuCamera,
  LuSpeaker,
  LuMonitorSpeaker,
  LuNetwork,
  LuWifi,
} from 'react-icons/lu'
import { FaDesktop, FaApple, FaLinux, FaWindows, FaVideo, FaChromecast } from 'react-icons/fa6'
import { TbDeviceNintendo, TbDeviceImac } from 'react-icons/tb'

export interface Device {
  id: string
  name: string
  color: string
  icon: string
  mac: string
  ip: string
  port: string
  // Auto-collected
  sourceIp?: string
  subnetMask?: string
  gateway?: string
  interface?: string
  addedAt?: string
}

export interface NetworkInfo {
  source_ip: string | null
  subnet_mask: string | null
  gateway: string | null
  interface_name: string | null
}

export type Screen = 'power' | 'devices' | 'form'

export const COLORS = [
  '#2373ea',
  '#0ea5e9',
  '#6366f1',
  '#e23c3c',
  '#ea33ab',
  '#f43f5e',
  '#2ea043',
  '#16a34a',
  '#84cc16',
  '#e28b2e',
  '#eab308',
  '#f97316',
  '#9333ea',
  '#7c3aed',
  '#a855f7',
  '#14b8a6',
  '#06b6d4',
  '#0d9488',
  '#64748b',
  '#6b7280',
]

export const ICONS = [
  // Computers
  'LuMonitor',
  'LuLaptop',
  'FaDesktop',
  'TbDeviceImac',
  // OS-specific
  'FaWindows',
  'FaApple',
  'FaLinux',
  // Mobile
  'LuSmartphone',
  'LuTablet',
  // Networking
  'LuRouter',
  'LuNetwork',
  'LuWifi',
  // Servers & storage
  'LuServer',
  'LuHardDrive',
  'LuCpu',
  // Gaming
  'LuGamepad2',
  'TbDeviceNintendo',
  // Media & peripherals
  'LuTv',
  'FaVideo',
  'FaChromecast',
  'LuSpeaker',
  'LuMonitorSpeaker',
  // Other
  'LuPrinter',
  'LuCamera',
] as const

export const ICON_MAP = {
  LuMonitor,
  LuLaptop,
  FaDesktop,
  TbDeviceImac,
  FaWindows,
  FaApple,
  FaLinux,
  LuSmartphone,
  LuTablet,
  LuRouter,
  LuNetwork,
  LuWifi,
  LuServer,
  LuHardDrive,
  LuCpu,
  LuGamepad2,
  TbDeviceNintendo,
  LuTv,
  FaVideo,
  FaChromecast,
  LuSpeaker,
  LuMonitorSpeaker,
  LuPrinter,
  LuCamera,
} as const
