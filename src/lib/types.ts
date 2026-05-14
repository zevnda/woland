import {
  LuRouter,
  LuPrinter,
  LuServer,
  LuHardDrive,
  LuCpu,
  LuGamepad2,
  LuCamera,
  LuSpeaker,
  LuNetwork,
  LuWifi,
  LuVideo,
} from 'react-icons/lu'
import { FaChromecast, FaLaptop, FaComputer } from 'react-icons/fa6'
import { TbDeviceNintendo, TbDeviceImac, TbBrandWindows } from 'react-icons/tb'
import { FiTv } from 'react-icons/fi'
import { MdMonitor, MdOutlinePhoneAndroid, MdOutlineTabletAndroid } from 'react-icons/md'
import { AiOutlineApple, AiOutlineLinux } from 'react-icons/ai'

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
  '#06b6d4',
  '#6366f1',
  '#7c3aed',
  '#9333ea',
  '#a855f7',
  '#ea33ab',
  '#f43f5e',
  '#e23c3c',
  '#f97316',
  '#e28b2e',
  '#eab308',
  '#84cc16',
  '#16a34a',
  '#2ea043',
  '#14b8a6',
  '#0d9488',
  '#64748b',
  '#6b7280',
]

export const ICONS = [
  // Devices
  'MdMonitor',
  'FaLaptop',
  'FaComputer',
  'FiTv',
  'TbDeviceImac',
  'MdOutlinePhoneAndroid',
  'MdOutlineTabletAndroid',
  'LuGamepad2',
  'TbDeviceNintendo',
  'LuPrinter',
  'LuCamera',
  // OS-specific
  'TbBrandWindows',
  'AiOutlineApple',
  'AiOutlineLinux',
  // Networking
  'LuRouter',
  'LuNetwork',
  'LuWifi',
  // Servers & storage
  'LuServer',
  'LuHardDrive',
  'LuCpu',
  // Media & peripherals
  'LuVideo',
  'FaChromecast',
  'LuSpeaker',
] as const

export const ICON_MAP = {
  // Devices
  MdMonitor,
  FaLaptop,
  FaComputer,
  TbDeviceImac,
  FiTv,
  MdOutlinePhoneAndroid,
  MdOutlineTabletAndroid,
  LuGamepad2,
  TbDeviceNintendo,
  LuPrinter,
  LuCamera,
  // OS-specific
  TbBrandWindows,
  AiOutlineApple,
  AiOutlineLinux,
  // Networking
  LuRouter,
  LuNetwork,
  LuWifi,
  // Servers & storage
  LuServer,
  LuHardDrive,
  LuCpu,
  // Media & peripherals
  LuVideo,
  FaChromecast,
  LuSpeaker,
} as const
