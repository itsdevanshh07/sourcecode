import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { MotionWrapper } from '../lib/motion.jsx'
import { Search, MapPin } from 'lucide-react'

const Hero = () => {

    const { setSearchFilter, setIsSearched } = useContext(AppContext)

    const titleRef = useRef(null)
    const locationRef = useRef(null)

    const onSearch = () => {
        setSearchFilter({
            title: titleRef.current.value,
            location: locationRef.current.value
        })
        setIsSearched(true)
    }

    return (
        <div className='container 2xl:px-20 mx-auto my-10'>
            <MotionWrapper variant="staggerContainer" className='bg-gradient-to-r from-navy to-navy-dark dark:from-navy-dark dark:to-black text-white py-20 text-center mx-2 rounded-3xl shadow-xl relative overflow-hidden'>

                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <MotionWrapper variant="slideUp">
                    <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight'>
                        Find Your Dream Job <br className='hidden md:block' />
                        <span className='text-sky'>Build Your Future</span>
                    </h2>
                </MotionWrapper>

                <MotionWrapper variant="slideUp">
                    <p className='mb-10 max-w-2xl mx-auto text-base md:text-lg font-light px-5 text-cream/90'>
                        Explore thousands of job opportunities with top companies.
                        Create your resume, practice interviews, and get hired.
                    </p>
                </MotionWrapper>

                <MotionWrapper variant="scaleIn" className='flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-navy rounded-full text-navy dark:text-cream max-w-2xl pl-6 pr-2 py-2 mx-4 sm:mx-auto shadow-lg'>
                    <div className='flex items-center w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-sky/30 mb-2 sm:mb-0'>
                        <Search className='text-sky mr-3' size={20} />
                        <input type="text"
                            placeholder='Job title, keywords...'
                            className='text-sm p-2 rounded outline-none w-full bg-transparent dark:text-cream dark:placeholder-cream/50 placeholder-navy/60'
                            ref={titleRef}
                        />
                    </div>
                    <div className='flex items-center w-full sm:w-1/2 pl-0 sm:pl-4 mb-2 sm:mb-0'>
                        <MapPin className='text-sky mr-3' size={20} />
                        <input type="text"
                            placeholder='Location'
                            className='text-sm p-2 rounded outline-none w-full bg-transparent dark:text-cream dark:placeholder-cream/50 placeholder-navy/60'
                            ref={locationRef}
                        />
                    </div>
                    <button
                        onClick={onSearch}
                        className='bg-sky hover:bg-sky/80 text-navy px-8 py-3 rounded-full m-1 transition-all hover:shadow-md font-medium w-full sm:w-auto'
                    >
                        Search
                    </button>
                </MotionWrapper>
            </MotionWrapper>
        </div>
    )
}

export default Hero