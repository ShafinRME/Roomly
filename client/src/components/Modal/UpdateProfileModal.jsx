import PropTypes from 'prop-types'
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Fragment, useState } from 'react'
import { TbFidgetSpinner } from 'react-icons/tb'
import { FiUpload, FiUser } from 'react-icons/fi'
import useAuth from '../../hooks/useAuth'
import { imageUpload } from '../../api/utils'
import toast from 'react-hot-toast'

const UpdateProfileModal = ({ isOpen, setIsOpen }) => {
  const { user, updateUserProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(user?.photoURL || '')
  const [imageFile, setImageFile] = useState(null)
  const [name, setName] = useState(user?.displayName || '')

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      let photoURL = user?.photoURL

      // Upload new image if selected
      if (imageFile) {
        photoURL = await imageUpload(imageFile)
      }

      // Update Firebase profile
      await updateUserProfile(name, photoURL)

      toast.success('Profile updated successfully!')
      setIsOpen(false)
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={() => setIsOpen(false)}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/40 backdrop-blur-sm' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all'>
                {/* Header */}
                <div className='bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-5'>
                  <DialogTitle className='text-lg font-semibold text-white text-center'>
                    Update Profile
                  </DialogTitle>
                </div>

                <form onSubmit={handleSubmit} className='p-6 space-y-5'>
                  {/* Avatar Upload */}
                  <div className='flex flex-col items-center gap-3'>
                    <div className='relative'>
                      <img
                        src={imagePreview || 'https://i.ibb.co/jMqMaMd/user.png'}
                        alt='Preview'
                        className='w-24 h-24 rounded-full object-cover border-4 border-rose-100 shadow-md'
                      />
                      <label
                        htmlFor='photo-upload'
                        className='absolute -bottom-1 -right-1 bg-rose-500 text-white rounded-full p-1.5 cursor-pointer hover:bg-rose-600 transition shadow'
                      >
                        <FiUpload size={14} />
                      </label>
                      <input
                        id='photo-upload'
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleImageChange}
                      />
                    </div>
                    <p className='text-xs text-gray-400'>Click the icon to change photo</p>
                  </div>

                  {/* Name Field */}
                  <div className='space-y-1'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Full Name
                    </label>
                    <div className='relative'>
                      <FiUser className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                      <input
                        type='text'
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder='Enter your full name'
                        className='w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition text-gray-800'
                      />
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  <div className='space-y-1'>
                    <label className='block text-sm font-medium text-gray-700'>
                      Email Address
                    </label>
                    <input
                      type='email'
                      value={user?.email || ''}
                      disabled
                      className='w-full px-4 py-2.5 border border-gray-100 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed'
                    />
                    <p className='text-xs text-gray-400'>Email cannot be changed</p>
                  </div>

                  {/* Buttons */}
                  <div className='flex gap-3 pt-2'>
                    <button
                      type='button'
                      onClick={() => setIsOpen(false)}
                      className='flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      disabled={loading}
                      className='flex-1 py-2.5 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center'
                    >
                      {loading ? (
                        <TbFidgetSpinner className='animate-spin' size={20} />
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

UpdateProfileModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
}

export default UpdateProfileModal
