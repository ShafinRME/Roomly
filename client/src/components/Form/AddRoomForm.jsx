import { DateRange } from 'react-date-range'
import { TbFidgetSpinner } from 'react-icons/tb'
import { IoCloseCircle } from 'react-icons/io5'
import useCategories from '../../hooks/useCategories'
import PropTypes from 'prop-types'

const AddRoomForm = ({
    dates,
    handleDates,
    handleSubmit,
    imagePreviews,
    handleImages,
    removeImage,
    loading,
}) => {
    const [categories] = useCategories()

    return (
        <div className='w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center text-gray-800 rounded-xl bg-gray-50'>
            <form onSubmit={handleSubmit}>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
                    <div className='space-y-6'>
                        <div className='space-y-1 text-sm'>
                            <label htmlFor='location' className='block text-gray-600'>
                                Location
                            </label>
                            <input
                                className='w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md '
                                name='location'
                                id='location'
                                type='text'
                                placeholder='Location'
                                required
                            />
                        </div>

                        <div className='space-y-1 text-sm'>
                            <label htmlFor='category' className='block text-gray-600'>
                                Category
                            </label>
                            <select
                                required
                                className='w-full px-4 py-3 border-rose-300 focus:outline-rose-500 rounded-md'
                                name='category'
                            >
                                {categories.map(category => (
                                    <option value={category.label} key={category.label}>
                                        {category.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='space-y-1'>
                            <label htmlFor='location' className='block text-gray-600'>
                                Select Availability Range
                            </label>
                            {/* Calendar */}
                            <DateRange
                                rangeColors={['#F43F5E']}
                                editableDateInputs={true}
                                onChange={item => handleDates(item)}
                                moveRangeOnFirstSelection={false}
                                ranges={[dates]}
                                minDate={new Date()}
                            />
                        </div>
                    </div>
                    <div className='space-y-6'>
                        <div className='space-y-1 text-sm'>
                            <label htmlFor='title' className='block text-gray-600'>
                                Title
                            </label>
                            <input
                                className='w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md '
                                name='title'
                                id='title'
                                type='text'
                                placeholder='Title'
                                required
                            />
                        </div>

                        {/* Multiple Image Upload Section */}
                        <div className='space-y-2'>
                            <label className='block text-gray-600 text-sm'>
                                Upload Images (Max 5)
                            </label>
                            <div className='p-4 bg-white w-full rounded-lg border-2 border-dashed border-gray-300'>
                                <div className='flex flex-col items-center justify-center'>
                                    <label className='w-full cursor-pointer'>
                                        <input
                                            className='hidden'
                                            type='file'
                                            onChange={handleImages}
                                            name='images'
                                            id='images'
                                            accept='image/jpeg,image/jpg,image/png,image/webp,image/avif'
                                            multiple
                                        />
                                        <div className='bg-rose-500 text-white text-center rounded font-semibold cursor-pointer p-3 hover:bg-rose-600 transition'>
                                            Choose Images
                                        </div>
                                    </label>
                                    <p className='text-xs text-gray-500 mt-2'>
                                        Upload up to 5 images (JPG, PNG, WebP, AVIF)
                                    </p>
                                </div>
                            </div>

                            {/* Image Previews Grid */}
                            {imagePreviews.length > 0 && (
                                <div className='grid grid-cols-3 gap-3 mt-4'>
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className='relative group'>
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className='w-full h-24 object-cover rounded-lg border-2 border-gray-200'
                                            />
                                            <button
                                                type='button'
                                                onClick={() => removeImage(index)}
                                                className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                                            >
                                                <IoCloseCircle size={20} />
                                            </button>
                                            {index === 0 && (
                                                <span className='absolute bottom-1 left-1 bg-rose-500 text-white text-xs px-2 py-1 rounded'>
                                                    Cover
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className='flex justify-between gap-2'>
                            <div className='space-y-1 text-sm'>
                                <label htmlFor='price' className='block text-gray-600'>
                                    Price
                                </label>
                                <input
                                    className='w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md '
                                    name='price'
                                    id='price'
                                    type='number'
                                    placeholder='Price'
                                    required
                                />
                            </div>

                            <div className='space-y-1 text-sm'>
                                <label htmlFor='guest' className='block text-gray-600'>
                                    Total guest
                                </label>
                                <input
                                    className='w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md '
                                    name='total_guest'
                                    id='guest'
                                    type='number'
                                    placeholder='Total guest'
                                    required
                                />
                            </div>
                        </div>

                        <div className='flex justify-between gap-2'>
                            <div className='space-y-1 text-sm'>
                                <label htmlFor='bedrooms' className='block text-gray-600'>
                                    Bedrooms
                                </label>
                                <input
                                    className='w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md '
                                    name='bedrooms'
                                    id='bedrooms'
                                    type='number'
                                    placeholder='Bedrooms'
                                    required
                                />
                            </div>

                            <div className='space-y-1 text-sm'>
                                <label htmlFor='bathrooms' className='block text-gray-600'>
                                    Bathrooms
                                </label>
                                <input
                                    className='w-full px-4 py-3 text-gray-800 border border-rose-300 focus:outline-rose-500 rounded-md '
                                    name='bathrooms'
                                    id='bathrooms'
                                    type='number'
                                    placeholder='Bathrooms'
                                    required
                                />
                            </div>
                        </div>

                        <div className='space-y-1 text-sm'>
                            <label htmlFor='description' className='block text-gray-600'>
                                Description
                            </label>

                            <textarea
                                id='description'
                                className='block rounded-md focus:rose-300 w-full h-32 px-4 py-3 text-gray-800  border border-rose-300 focus:outline-rose-500 '
                                name='description'
                            ></textarea>
                        </div>
                    </div>
                </div>

                <button
                    disabled={loading}
                    type='submit'
                    className='w-full p-3 mt-5 text-center font-medium text-white transition duration-200 rounded shadow-md bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400'
                >
                    {loading ? (
                        <TbFidgetSpinner className='animate-spin m-auto' />
                    ) : (
                        'Save & Continue'
                    )}
                </button>
            </form>
        </div>
    )
}

AddRoomForm.propTypes = {
    dates: PropTypes.object,
    handleDates: PropTypes.func,
    handleSubmit: PropTypes.func,
    imagePreviews: PropTypes.array,
    handleImages: PropTypes.func,
    removeImage: PropTypes.func,
    loading: PropTypes.bool,
}

export default AddRoomForm
