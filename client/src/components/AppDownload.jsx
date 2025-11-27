import { assets } from '../assets/assets'

const AppDownload = () => {
    return (
        <div className='container px-4 2xl:px-20 mx-auto my-20'>
            <div className='bg-gradient-to-br from-cream to-white dark:from-card-bg dark:to-dark-bg rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700'>
                <div className='flex flex-col lg:flex-row items-center justify-between'>

                    {/* Left Side: Text & Buttons */}
                    <div className='w-full lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center items-start text-left'>
                        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy dark:text-white mb-8 leading-tight tracking-tight'>
                            Download Mobile App <br />
                            <span className='text-primary'>For Better Experience</span>
                        </h1>
                        <p className='text-gray-600 dark:text-gray-300 mb-10 text-lg max-w-md'>
                            Get real-time job updates, track applications, and chat with recruiters on the go.
                        </p>
                        <div className='flex flex-wrap gap-4'>
                            <a href="#" className='transition-transform hover:scale-105 hover:shadow-lg rounded-lg'>
                                <img className='h-14' src={assets.play_store} alt="Get it on Google Play" />
                            </a>
                            <a href="#" className='transition-transform hover:scale-105 hover:shadow-lg rounded-lg'>
                                <img className='h-14' src={assets.app_store} alt="Download on the App Store" />
                            </a>
                        </div>
                    </div>

                    {/* Right Side: Image */}
                    <div className='w-full lg:w-1/2 flex justify-center lg:justify-end items-end relative pt-10 lg:pt-0'>
                        <img
                            className='w-full max-w-sm lg:max-w-md xl:max-w-lg object-contain drop-shadow-2xl'
                            src={assets.app_main_img}
                            alt="Mobile App Preview"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppDownload