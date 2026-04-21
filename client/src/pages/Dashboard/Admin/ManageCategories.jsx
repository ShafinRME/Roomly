import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import toast from 'react-hot-toast'
import { MdDelete } from 'react-icons/md'
import { FiPlus } from 'react-icons/fi'
import { Helmet } from 'react-helmet-async'

const availableIcons = [
    'TbBeach', 'GiWindmill', 'MdOutlineVilla', 'TbMountain',
    'TbPool', 'GiIsland', 'GiBoatFishing', 'FaSkiing',
    'GiCastle', 'GiCaveEntrance', 'GiForestCamp', 'BsSnow',
    'GiCactus', 'GiBarn', 'IoDiamond', 'FaUmbrellaBeach', 'FaMountain', 'FaCity', 'FaPaw', 'GiWaterfall', 'FaLandmark'
]

const ManageCategories = () => {
    const axiosSecure = useAxiosSecure()
    const queryClient = useQueryClient()
    const [label, setLabel] = useState('')
    const [selectedIcon, setSelectedIcon] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState(null)

    // Fetch categories
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await axiosSecure('/categories')
            return data
        },
    })

    // Add category
    const { mutateAsync: addCategory, isPending: adding } = useMutation({
        mutationFn: async newCat => {
            const { data } = await axiosSecure.post('/category', newCat)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categories'])
            toast.success('Category added!')
            setLabel('')
            setSelectedIcon('')
            setIsAdding(false)
        },
        onError: err => {
            toast.error(err?.response?.data?.message || 'Failed to add category')
        },
    })

    // Delete category
    const { mutateAsync: deleteCategory, isPending: deleting } = useMutation({
        mutationFn: async id => {
            const { data } = await axiosSecure.delete(`/category/${id}`)
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['categories'])
            toast.success('Category deleted!')
        },
        onError: err => {
            toast.error(err?.response?.data?.message || 'Failed to delete category')
        },
    })

    const handleAdd = async e => {
        e.preventDefault()
        if (!label.trim()) return toast.error('Label is required')
        if (!selectedIcon) return toast.error('Please select an icon')
        await addCategory({ label: label.trim(), icon: selectedIcon })
    }

    const handleConfirmDelete = async () => {
        await deleteCategory(deleteTarget._id)
        setDeleteTarget(null)
    }

    if (isLoading) return <LoadingSpinner />

    return (
        <div className='container mx-auto px-4 py-8'>
            <Helmet><title>Manage Categories</title></Helmet>

            <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>
                    Manage Categories
                    <span className='ml-2 text-sm font-normal text-gray-400'>
                        ({categories.length} total)
                    </span>
                </h2>
                <button
                    onClick={() => setIsAdding(v => !v)}
                    className='flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition text-sm font-semibold'
                >
                    <FiPlus size={16} />
                    Add Category
                </button>
            </div>

            {/* Add Category Form */}
            {isAdding && (
                <div className='bg-rose-50 border border-rose-100 rounded-xl p-5 mb-6'>
                    <h3 className='font-semibold text-gray-700 mb-4'>New Category</h3>
                    <form onSubmit={handleAdd} className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-600 mb-1'>
                                Category Name
                            </label>
                            <input
                                type='text'
                                value={label}
                                onChange={e => setLabel(e.target.value)}
                                placeholder='e.g. Treehouses'
                                className='w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 text-gray-800'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-600 mb-2'>
                                Select Icon
                            </label>
                            <div className='flex flex-wrap gap-2'>
                                {availableIcons.map(icon => (
                                    <button
                                        key={icon}
                                        type='button'
                                        onClick={() => setSelectedIcon(icon)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${selectedIcon === icon
                                            ? 'bg-rose-500 text-white border-rose-500'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
                                            }`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                            {selectedIcon && (
                                <p className='text-xs text-rose-500 mt-1'>
                                    Selected: {selectedIcon}
                                </p>
                            )}
                        </div>

                        <div className='flex gap-3'>
                            <button
                                type='submit'
                                disabled={adding}
                                className='px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition font-medium disabled:opacity-60'
                            >
                                {adding ? 'Adding...' : 'Add Category'}
                            </button>
                            <button
                                type='button'
                                onClick={() => setIsAdding(false)}
                                className='px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium'
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories Table */}
            <div className='bg-white rounded-xl shadow overflow-hidden'>
                <table className='min-w-full leading-normal'>
                    <thead>
                        <tr>
                            <th className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-semibold'>
                                #
                            </th>
                            <th className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-semibold'>
                                Category Name
                            </th>
                            <th className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-semibold'>
                                Icon
                            </th>
                            <th className='px-5 py-3 bg-white border-b border-gray-200 text-gray-800 text-left text-sm uppercase font-semibold'>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat, index) => (
                            <tr key={cat._id} className='hover:bg-gray-50 transition'>
                                <td className='px-5 py-4 border-b border-gray-200 text-sm text-gray-500'>
                                    {index + 1}
                                </td>
                                <td className='px-5 py-4 border-b border-gray-200 text-sm font-semibold text-gray-800'>
                                    {cat.label}
                                </td>
                                <td className='px-5 py-4 border-b border-gray-200 text-sm text-gray-500 font-mono'>
                                    {cat.icon}
                                </td>
                                <td className='px-5 py-4 border-b border-gray-200 text-sm'>
                                    <button
                                        onClick={() => setDeleteTarget(cat)}
                                        className='flex items-center gap-1 text-red-500 hover:text-red-700 font-medium transition'
                                    >
                                        <MdDelete size={18} />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={4} className='px-5 py-8 text-center text-gray-400'>
                                    No categories found. Add one above.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div
                    className='fixed inset-0 bg-black/40 flex items-center justify-center z-50'
                    onClick={() => setDeleteTarget(null)}
                >
                    <div
                        className='bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4'
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className='flex justify-center mb-4'>
                            <div className='w-12 h-12 rounded-full bg-red-100 flex items-center justify-center'>
                                <MdDelete size={24} className='text-red-500' />
                            </div>
                        </div>

                        {/* Text */}
                        <h3 className='text-lg font-semibold text-gray-800 text-center mb-1'>
                            Delete Category?
                        </h3>
                        <p className='text-sm text-gray-500 text-center mb-6'>
                            Are you sure you want to delete{' '}
                            <span className='font-semibold text-gray-700'>
                                &quot;{deleteTarget.label}&quot;
                            </span>
                            ? This action cannot be undone.
                        </p>

                        {/* Buttons */}
                        <div className='flex gap-3'>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                disabled={deleting}
                                className='flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-60'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                className='flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium disabled:opacity-60'
                            >
                                {deleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageCategories