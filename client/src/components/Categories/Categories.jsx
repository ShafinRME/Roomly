import Container from '../Shared/Container'
import CategoryBox from './CategoryBox'
import useCategories from '../../hooks/useCategories.js'
import SearchBar from '../SearchBar/SearchBar.jsx'
const Categories = () => {
  const [categories, isLoading] = useCategories()
  if (isLoading) return null
  return (
    <Container>
      <div className='flex justify-center items-center mx-auto w-auto'>
        <SearchBar />
      </div>
      <div className='pt-4 flex items-center justify-between overflow-x-auto'>
        {categories.map(item => (
          <CategoryBox key={item.label} label={item.label} icon={item.icon} />
        ))}
      </div>
    </Container>
  )
}

export default Categories
