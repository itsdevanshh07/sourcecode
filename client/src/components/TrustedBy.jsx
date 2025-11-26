import React from 'react'
import { assets } from '../assets/assets'
import { MotionWrapper } from '../lib/motion.jsx'

const TrustedBy = () => {
    return (
        <div className='container 2xl:px-20 mx-auto my-10'>
            <MotionWrapper variant="fadeIn" className='border border-sky/20 dark:border-navy shadow-sm mx-2 p-6 rounded-2xl bg-cream dark:bg-navy'>
                <div className='flex justify-center items-center gap-8 lg:gap-12 flex-wrap w-full'>
                    <p className='font-semibold text-navy dark:text-sky text-lg'>Trusted by</p>
                    <div className='flex items-center gap-8 lg:gap-12 flex-wrap justify-center opacity-70 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500'>
                        <img className='h-6 dark:invert' src={assets.microsoft_logo} alt="Microsoft" />
                        <img className='h-6 dark:invert' src={assets.walmart_logo} alt="Walmart" />
                        <img className='h-6 dark:invert' src={assets.accenture_logo} alt="Accenture" />
                        <img className='h-6 dark:invert' src={assets.samsung_logo} alt="Samsung" />
                        <img className='h-6 dark:invert' src={assets.amazon_logo} alt="Amazon" />
                        <img className='h-6 dark:invert' src={assets.adobe_logo} alt="Adobe" />
                    </div>
                </div>
            </MotionWrapper>
        </div>
    )
}

export default TrustedBy
