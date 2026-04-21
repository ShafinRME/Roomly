import Container from '../Shared/Container'
import CategoryBox from './CategoryBox'
import useCategories from '../../hooks/useCategories.js'
import SearchBar from '../SearchBar/SearchBar.jsx'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BsGrid } from 'react-icons/bs' // or any icon you prefer

const Categories = () => {
  const [categories, isLoading] = useCategories()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const category = params.get('category')

  const handleAllClick = () => {
    navigate('/') // clears all query params
  }

  if (isLoading) return null
  return (
    <Container>
      <div className='flex justify-center items-center mx-auto w-auto'>
        <SearchBar />
      </div>
      <div className='pt-4 flex items-center justify-between overflow-x-auto scrollbar-hide'>

        {/* ✅ ALL button */}
        <div
          onClick={handleAllClick}
          className={`flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer
            ${!category ? 'border-b-neutral-800 text-neutral-800' : 'border-b-transparent text-neutral-500'}
          `}
          style={{ minHeight: '72px' }}
        >
          <BsGrid size={26} />
          <div className='text-sm font-medium w-16 text-center leading-tight'>All</div>
        </div>

        {categories.map(item => (
          <CategoryBox key={item.label} label={item.label} icon={item.icon} />
        ))}
      </div>
    </Container>
  )
}

export default Categories