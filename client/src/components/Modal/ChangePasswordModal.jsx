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
import { FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from 'firebase/auth'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'



const PasswordField = ({ label, value, onChange, placeholder, id }) => {
  const [show, setShow] = useState(false)
  return (
    <div className='space-y-1'>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
        {label}
      </label>
      <div className='relative'>
        <FiLock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required
          minLength={6}
          placeholder={placeholder}
          className='w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition text-gray-800'
        />
        <button
          type='button'
          onClick={() => setShow(s => !s)}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition'
        >
          {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      </div>
    </div>
  )
}

PasswordField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  id: PropTypes.string,
}

const ChangePasswordModal = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  // Check if user signed in with Google (no password)
  const isGoogleUser = user?.providerData?.some(p => p.providerId === 'google.com')

  const handleClose = () => {
    setIsOpen(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match.')
    }
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters.')
    }
    if (currentPassword === newPassword) {
      return setError('New password must differ from current password.')
    }

    setLoading(true)
    try {
      const auth = getAuth()
      const currentUser = auth.currentUser

      // Re-authenticate before changing password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      )
      await reauthenticateWithCredential(currentUser, credential)

      // Update password
      await updatePassword(currentUser, newPassword)

      toast.success('Password changed successfully!')
      handleClose()
    } catch (err) {
      console.error(err)
      if (
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setError('Current password is incorrect.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please try again later.')
      } else {
        setError(err.message || 'Failed to change password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={handleClose}>
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
                    Change Password
                  </DialogTitle>
                </div>

                {/* Google user warning */}
                {isGoogleUser ? (
                  <div className='p-6 text-center space-y-4'>
                    <div className='flex justify-center'>
                      <div className='bg-yellow-50 rounded-full p-4'>
                        <FiAlertCircle className='text-yellow-500' size={32} />
                      </div>
                    </div>
                    <p className='text-gray-600 text-sm'>
                      Your account uses <strong>Google Sign-In</strong>. Password
                      management is handled by Google and cannot be changed here.
                    </p>
                    <button
                      onClick={handleClose}
                      className='w-full py-2.5 rounded-lg bg-rose-500 text-white font-medium hover:bg-rose-600 transition'
                    >
                      Got It
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className='p-6 space-y-4'>
                    {/* Error Alert */}
                    {error && (
                      <div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-lg'>
                        <FiAlertCircle size={16} className='flex-shrink-0' />
                        <span>{error}</span>
                      </div>
                    )}

                    <PasswordField
                      id='current-password'
                      label='Current Password'
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder='Enter current password'
                    />

                    <PasswordField
                      id='new-password'
                      label='New Password'
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder='Enter new password (min 6 chars)'
                    />

                    <PasswordField
                      id='confirm-password'
                      label='Confirm New Password'
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder='Re-enter new password'
                    />

                    {/* Password strength hint */}
                    {newPassword && (
                      <div className='space-y-1'>
                        <div className='flex gap-1'>
                          {[1, 2, 3, 4].map(i => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${newPassword.length >= i * 3
                                ? newPassword.length >= 10
                                  ? 'bg-green-400'
                                  : newPassword.length >= 7
                                    ? 'bg-yellow-400'
                                    : 'bg-red-400'
                                : 'bg-gray-200'
                                }`}
                            />
                          ))}
                        </div>
                        <p className='text-xs text-gray-400'>
                          {newPassword.length < 7
                            ? 'Weak'
                            : newPassword.length < 10
                              ? 'Medium'
                              : 'Strong'}{' '}
                          password
                        </p>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className='flex gap-3 pt-2'>
                      <button
                        type='button'
                        onClick={handleClose}
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
                          'Update Password'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

ChangePasswordModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
}

export default ChangePasswordModal
