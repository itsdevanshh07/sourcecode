import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { variants } from '../lib/motion.jsx'
import { useMotion } from '../context/MotionContext'
import { useTheme } from '../context/ThemeContext'
import { Moon, Sun } from 'lucide-react'
import asap_logo_light from '../assets/logo_rocket_generated.svg'
import asap_logo_dark from '../assets/logo_rocket_generated.svg'

const Navbar = () => {

    const { openSignIn } = useClerk()
    const { user } = useUser()
    const navigate = useNavigate()
    const { setShowRecruiterLogin } = useContext(AppContext)
    const { animationsEnabled } = useMotion()
    const { theme, toggleTheme } = useTheme()

    return (
        <motion.div
            className='shadow py-4 bg-cream dark:bg-navy-dark dark:border-b dark:border-navy transition-colors duration-300 sticky top-0 z-50'
            initial={animationsEnabled ? "hidden" : "visible"}
            animate="visible"
            variants={variants.slideUp}
        >
            <div className='container px-4 2xl:px-20 mx-auto flex justify-between items-center'>
                <img
                    onClick={() => navigate('/')}
                    className='cursor-pointer h-20 hover:scale-105 transition-transform duration-300'
                    src={theme === 'dark' ? asap_logo_dark : asap_logo_light}
                    alt="ASAP Logo"
                />

                <div className='flex items-center gap-6'>
                    <Link to={'/'} className='text-navy dark:text-sky hover:text-sky dark:hover:text-cream transition-colors font-medium'>
                        Home
                    </Link>
                    <Link to={'/resume-builder'} className='text-navy dark:text-sky hover:text-sky dark:hover:text-cream transition-colors font-medium'>
                        Resume Builder
                    </Link>
                    <button
                        onClick={toggleTheme}
                        className='p-2 rounded-full hover:bg-white dark:hover:bg-navy transition-colors text-navy dark:text-sky'
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>

                    {
                        user
                            ? <div className='flex items-center gap-3'>
                                <Link to={'/applications'} className='text-navy dark:text-sky hover:text-sky dark:hover:text-cream transition-colors'>Applied Jobs</Link>
                                <p className='text-sky/50'>|</p>
                                <p className='max-sm:hidden text-navy dark:text-cream'>Hi, {user.firstName + " " + user.lastName}</p>
                                <UserButton />
                            </div>
                            : <div className='flex gap-4 max-sm:text-xs'>
                                <button onClick={e => setShowRecruiterLogin(true)} className='text-navy dark:text-sky hover:text-sky dark:hover:text-cream transition-colors'>Recruiter Login</button>
                                <button onClick={e => openSignIn()} className='bg-navy hover:bg-sky text-white px-6 sm:px-9 py-2 rounded-full transition-colors shadow-md hover:shadow-lg'>Login</button>
                            </div>
                    }
                </div>
            </div>
        </motion.div>
    )
}

export default Navbar