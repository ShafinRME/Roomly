import useAuth from '../../../hooks/useAuth'
import { Helmet } from 'react-helmet-async'
import useRole from '../../../hooks/useRole'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import { useState } from 'react'
import UpdateProfileModal from '../../../components/Modal/UpdateProfileModal'
import ChangePasswordModal from '../../../components/Modal/ChangePasswordModal'
import { FiEdit2, FiLock, FiMail, FiUser } from 'react-icons/fi'

const Profile = () => {
  const { user, loading } = useAuth() || {}
  const [role, isLoading] = useRole()
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)

  if (isLoading || loading) return <LoadingSpinner />

  // Check if user signed in with Google
  const isGoogleUser = user?.providerData?.some(
    p => p.providerId === 'google.com'
  )

  const roleBadgeColor = {
    admin: 'bg-purple-500',
    host: 'bg-rose-500',
    guest: 'bg-blue-500',
  }

  return (
    <div className='flex justify-center items-center min-h-[calc(100vh-80px)] px-4 py-8'>
      <Helmet>
        <title>Profile | StayVista</title>
      </Helmet>

      <div className='bg-white shadow-xl rounded-2xl w-full max-w-xl overflow-hidden'>
        {/* Banner */}
        <div className='relative h-36 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500'>
          <div className='absolute inset-0 opacity-20'>
            <svg width='100%' height='100%' viewBox='0 0 400 144'>
              <circle cx='50' cy='30' r='60' fill='white' fillOpacity='0.3' />
              <circle cx='350' cy='100' r='80' fill='white' fillOpacity='0.2' />
              <circle cx='200' cy='20' r='40' fill='white' fillOpacity='0.15' />
            </svg>
          </div>
        </div>

        {/* Avatar */}
        <div className='flex flex-col items-center -mt-14 px-6 pb-6'>
          <div className='relative'>
            <img
              src={user?.photoURL || 'https://i.ibb.co/jMqMaMd/user.png'}
              alt='Profile'
              referrerPolicy='no-referrer'
              className='w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg'
            />
            <button
              onClick={() => setIsUpdateOpen(true)}
              className='absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full p-1.5 shadow-md hover:bg-rose-600 transition'
              title='Edit profile'
            >
              <FiEdit2 size={14} />
            </button>
          </div>

          {/* Role Badge */}
          <span
            className={`mt-3 px-4 py-0.5 text-xs font-semibold text-white rounded-full uppercase tracking-widest ${
              roleBadgeColor[role] || 'bg-gray-400'
            }`}
          >
            {role}
          </span>

          {/* Name */}
          <h2 className='mt-2 text-xl font-bold text-gray-800'>
            {user?.displayName}
          </h2>

          {/* UID */}
          <p className='text-xs text-gray-400 mt-0.5 font-mono'>
            ID: {user?.uid}
          </p>

          {/* Divider */}
          <hr className='w-full my-5 border-gray-100' />

          {/* Info Grid */}
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
            <div className='flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3'>
              <div className='bg-rose-100 rounded-full p-2'>
                <FiUser className='text-rose-500' size={16} />
              </div>
              <div>
                <p className='text-xs text-gray-400'>Full Name</p>
                <p className='text-sm font-semibold text-gray-800'>
                  {user?.displayName || '—'}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3'>
              <div className='bg-rose-100 rounded-full p-2'>
                <FiMail className='text-rose-500' size={16} />
              </div>
              <div className='min-w-0'>
                <p className='text-xs text-gray-400'>Email</p>
                <p className='text-sm font-semibold text-gray-800 truncate'>
                  {user?.email}
                </p>
              </div>
            </div>

            <div className='flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3'>
              <div className='bg-rose-100 rounded-full p-2'>
                <FiLock className='text-rose-500' size={16} />
              </div>
              <div>
                <p className='text-xs text-gray-400'>Sign-in Method</p>
                <p className='text-sm font-semibold text-gray-800'>
                  {isGoogleUser ? 'Google' : 'Email & Password'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='w-full flex flex-col sm:flex-row gap-3'>
            <button
              onClick={() => setIsUpdateOpen(true)}
              className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition shadow-sm'
            >
              <FiEdit2 size={16} />
              Update Profile
            </button>

            <button
              onClick={() => setIsPasswordOpen(true)}
              className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-rose-500 text-rose-500 font-semibold hover:bg-rose-50 transition'
            >
              <FiLock size={16} />
              Change Password
            </button>
          </div>

          {/* Google account notice */}
          {isGoogleUser && (
            <p className='mt-3 text-xs text-gray-400 text-center'>
              * Password management is handled by Google for your account.
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      <UpdateProfileModal isOpen={isUpdateOpen} setIsOpen={setIsUpdateOpen} />
      <ChangePasswordModal isOpen={isPasswordOpen} setIsOpen={setIsPasswordOpen} />
    </div>
  )
}

export default Profile
