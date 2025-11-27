import { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import { AppContext } from '../context/AppContext'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import { FileText, Edit, Check, Upload, Calendar, MapPin } from 'lucide-react'

const Applications = () => {

  const { user } = useUser()
  const { getToken } = useAuth()

  const [isEdit, setIsEdit] = useState(false)
  const [resume, setResume] = useState(null)

  const { backendUrl, userData, userApplications, fetchUserData, fetchUserApplications } = useContext(AppContext)

  const updateResume = async () => {
    try {
      const formData = new FormData()
      formData.append('resume', resume)
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/users/update-resume',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        await fetchUserData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setIsEdit(false)
    setResume(null)
  }

  useEffect(() => {
    if (user) {
      fetchUserApplications()
    }
  }, [user])

  return userData ? (
    <div className='container mx-auto px-4 py-12 max-w-6xl min-h-[75vh]'>

      {/* Resume Section */}
      <div className='mb-12'>
        <h2 className='text-2xl font-bold text-navy dark:text-white mb-6'>Your Resume</h2>
        <div className='bg-white dark:bg-card-bg p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-6'>

          {isEdit || (userData && userData.resume === "") ? (
            <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
              <label className='flex items-center justify-center gap-3 px-6 py-3 bg-blue-50 text-primary border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors w-full sm:w-auto' htmlFor="resumeUpload">
                <Upload size={20} />
                <span className='font-medium truncate max-w-[200px]'>{resume ? resume.name : "Upload Resume"}</span>
                <input id='resumeUpload' onChange={e => setResume(e.target.files[0])} accept='application/pdf' type="file" hidden />
              </label>
              <button
                onClick={updateResume}
                className='flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-secondary transition-colors font-medium shadow-md shadow-blue-200 dark:shadow-none w-full sm:w-auto'
              >
                <Check size={18} /> Save
              </button>
              {userData.resume && (
                <button onClick={() => setIsEdit(false)} className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-4 py-2'>Cancel</button>
              )}
            </div>
          ) : (
            <div className='flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg'>
              <a
                target='_blank'
                href={userData.resume}
                className='flex items-center gap-2 px-6 py-2 bg-white dark:bg-card-bg text-primary shadow-sm rounded-md font-medium transition-all'
                rel="noreferrer"
              >
                <FileText size={18} /> View Resume
              </a>
              <button
                onClick={() => setIsEdit(true)}
                className='flex items-center gap-2 px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors font-medium'
              >
                <Edit size={18} /> Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Jobs Applied Section */}
      <div>
        <h2 className='text-2xl font-bold text-navy dark:text-white mb-6'>Jobs Applied</h2>

        <div className='bg-white dark:bg-card-bg rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden'>
          {userApplications.length > 0 ? (
            <div className='divide-y divide-gray-100 dark:divide-gray-700'>
              {userApplications.map((job, index) => (
                <div key={index} className='p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4'>

                  {/* Job Info */}
                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0'>
                      <img className='w-full h-full object-contain' src={job.companyId.image} alt={job.companyId.name} />
                    </div>
                    <div>
                      <h3 className='font-semibold text-lg text-navy dark:text-white leading-tight'>{job.jobId.title}</h3>
                      <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>{job.companyId.name}</p>

                      <div className='flex flex-wrap gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500'>
                        <span className='flex items-center gap-1'><MapPin size={12} /> {job.jobId.location}</span>
                        <span className='flex items-center gap-1'><Calendar size={12} /> Applied {moment(job.date).fromNow()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className='flex items-center justify-between sm:justify-end w-full sm:w-auto mt-2 sm:mt-0'>
                    <span className={`
                      px-4 py-1.5 rounded-full text-sm font-medium border
                      ${job.status === 'Accepted'
                        ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                        : job.status === 'Rejected'
                          ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                          : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'}
                    `}>
                      {job.status}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className='p-12 text-center text-gray-500 dark:text-gray-400'>
              <p>No job applications found.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  ) : <Loading />
}

export default Applications