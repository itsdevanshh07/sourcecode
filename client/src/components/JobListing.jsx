import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'
import { X, Filter, ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react'

const JobListing = () => {

    const { isSearched, searchFilter, setSearchFilter, jobs, jobsLoading } = useContext(AppContext)

    const [showFilter, setShowFilter] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedLocations, setSelectedLocations] = useState([])

    const [filteredJobs, setFilteredJobs] = useState(jobs)

    const handleCategoryChange = (category) => {
        setSelectedCategories(
            prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        )
    }

    const handleLocationChange = (location) => {
        setSelectedLocations(
            prev => prev.includes(location) ? prev.filter(c => c !== location) : [...prev, location]
        )
    }

    useEffect(() => {

        const matchesCategory = job => selectedCategories.length === 0 || selectedCategories.includes(job.category)

        const matchesLocation = job => selectedLocations.length === 0 || selectedLocations.includes(job.location)

        const matchesTitle = job => searchFilter.title === "" || job.title.toLowerCase().includes(searchFilter.title.toLowerCase())

        const matchesSearchLocation = job => searchFilter.location === "" || job.location.toLowerCase().includes(searchFilter.location.toLowerCase())

        const newFilteredJobs = jobs.slice().reverse().filter(
            job => matchesCategory(job) && matchesLocation(job) && matchesTitle(job) && matchesSearchLocation(job)
        )

        setFilteredJobs(newFilteredJobs)
        setCurrentPage(1)
    }, [jobs, selectedCategories, selectedLocations, searchFilter])

    // Prevent body scroll when mobile filter is open
    useEffect(() => {
        if (showFilter) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [showFilter])

    return (
        <div className='container 2xl:px-20 mx-auto py-8 px-4'>

            <div className="flex flex-col lg:flex-row gap-8 relative">

                {/* Mobile Filter Toggle */}
                <div className="lg:hidden mb-4 flex justify-between items-center">
                    <h3 className='font-medium text-2xl text-navy dark:text-white'>Latest Jobs</h3>
                    <button
                        onClick={() => setShowFilter(true)}
                        className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors'
                    >
                        <Filter size={18} /> Filters
                    </button>
                </div>

                {/* Sidebar - Filters */}
                <div className={`
                    fixed inset-0 z-50 bg-white dark:bg-card-bg p-6 overflow-y-auto transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 lg:w-1/4 lg:bg-transparent lg:p-0 lg:block lg:overflow-visible
                    ${showFilter ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className="lg:sticky lg:top-24 space-y-6">

                        {/* Mobile Header */}
                        <div className="flex justify-between items-center lg:hidden mb-6">
                            <h3 className="text-xl font-bold text-navy dark:text-white">Filters</h3>
                            <button onClick={() => setShowFilter(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                <X size={24} className="text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>

                        {/* Active Filters */}
                        {isSearched && (searchFilter.title !== "" || searchFilter.location !== "") && (
                            <div className="bg-white dark:bg-card-bg p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className='font-semibold text-lg mb-4 text-navy dark:text-white'>Current Search</h3>
                                <div className='flex flex-wrap gap-2'>
                                    {searchFilter.title && (
                                        <span className='inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'>
                                            {searchFilter.title}
                                            <X
                                                size={14}
                                                className='cursor-pointer hover:text-blue-900'
                                                onClick={() => setSearchFilter(prev => ({ ...prev, title: "" }))}
                                            />
                                        </span>
                                    )}
                                    {searchFilter.location && (
                                        <span className='inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-sm dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'>
                                            {searchFilter.location}
                                            <X
                                                size={14}
                                                className='cursor-pointer hover:text-red-900'
                                                onClick={() => setSearchFilter(prev => ({ ...prev, location: "" }))}
                                            />
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Categories */}
                        <div className="bg-white dark:bg-card-bg p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h4 className='font-semibold text-lg mb-4 text-navy dark:text-white'>Categories</h4>
                            <ul className='space-y-3'>
                                {JobCategories.map((category, index) => (
                                    <li className='flex items-center gap-3 group cursor-pointer' key={index}>
                                        <div className="relative flex items-center">
                                            <input
                                                className='peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-primary checked:border-primary transition-all'
                                                type="checkbox"
                                                onChange={() => handleCategoryChange(category)}
                                                checked={selectedCategories.includes(category)}
                                            />
                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" viewBox="0 0 14 14" fill="none">
                                                <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">{category}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Locations */}
                        <div className="bg-white dark:bg-card-bg p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h4 className='font-semibold text-lg mb-4 text-navy dark:text-white'>Location</h4>
                            <ul className='space-y-3'>
                                {JobLocations.map((location, index) => (
                                    <li className='flex items-center gap-3 group cursor-pointer' key={index}>
                                        <div className="relative flex items-center">
                                            <input
                                                className='peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-primary checked:border-primary transition-all'
                                                type="checkbox"
                                                onChange={() => handleLocationChange(location)}
                                                checked={selectedLocations.includes(location)}
                                            />
                                            <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" viewBox="0 0 14 14" fill="none">
                                                <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors">{location}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Overlay for mobile */}
                    <div
                        className={`fixed inset-0 bg-black/50 z-[-1] lg:hidden transition-opacity ${showFilter ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setShowFilter(false)}
                    />
                </div>

                {/* Job Listings */}
                <section className='w-full lg:w-3/4'>
                    <div className="flex justify-between items-center mb-6 max-lg:hidden">
                        <div>
                            <h3 className='font-bold text-3xl text-navy dark:text-white' id='job-list'>Latest Jobs</h3>
                            <p className='text-gray-500 dark:text-gray-400 mt-1'>Get your desired job from top companies</p>
                        </div>
                    </div>

                    {jobsLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">Loading jobs...</p>
                        </div>
                    ) : (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                                {filteredJobs.slice((currentPage - 1) * 6, currentPage * 6).map((job, index) => (
                                    <JobCard key={index} job={job} />
                                ))}
                            </div>

                            {filteredJobs.length === 0 && (
                                <div className="text-center py-20 bg-white dark:bg-card-bg rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                    <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No jobs found</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {filteredJobs.length > 0 && (
                                <div className='flex items-center justify-center gap-2 mt-12'>
                                    <a href="#job-list">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                                            disabled={currentPage === 1}
                                            className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-800 dark:text-white transition-colors'
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                    </a>

                                    <div className="flex gap-2">
                                        {Array.from({ length: Math.ceil(filteredJobs.length / 6) }).map((_, index) => (
                                            <a key={index} href="#job-list">
                                                <button
                                                    onClick={() => setCurrentPage(index + 1)}
                                                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors font-medium ${currentPage === index + 1
                                                            ? 'bg-primary text-white shadow-md shadow-blue-200 dark:shadow-none'
                                                            : 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
                                                        }`}
                                                >
                                                    {index + 1}
                                                </button>
                                            </a>
                                        ))}
                                    </div>

                                    <a href="#job-list">
                                        <button
                                            onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredJobs.length / 6)))}
                                            disabled={currentPage === Math.ceil(filteredJobs.length / 6)}
                                            className='p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-800 dark:text-white transition-colors'
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </a>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    )
}

export default JobListing
