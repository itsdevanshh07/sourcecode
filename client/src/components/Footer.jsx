import React from 'react'
import { assets } from '../assets/assets'
import { useTheme } from '../context/ThemeContext'
import asap_logo from '../assets/logo_rocket_cream.svg'

const Footer = () => {
  const { theme } = useTheme()

  return (
    <div className='mt-20'>
      {/* Bottom Footer Bar - Alternate Palette */}
      <div className='bg-navy dark:bg-black py-4'>
        <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center max-sm:flex-col gap-4 text-white/80 text-sm'>

          {/* Left: Logo */}
          <div className="flex-1 flex justify-start">
            <img className='h-8' src={asap_logo} alt="ASAP Logo" />
          </div>

          {/* Center: Copyright */}
          <div className="flex-1 flex justify-center text-center">
            <p>2025 @ASAPJobPortal</p>
          </div>

          {/* Right: Links */}
          <div className='flex-1 flex justify-end gap-6'>
            <a href="#" className='hover:text-white transition-colors'>Privacy Policy</a>
            <a href="#" className='hover:text-white transition-colors'>Terms of Service</a>
            <a href="#" className='hover:text-white transition-colors'>Contact</a>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Footer