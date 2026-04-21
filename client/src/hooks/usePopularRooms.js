import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from './useAxiosSecure'

const usePopularRooms = () => {
    const axiosSecure = useAxiosSecure()
    const { data: popularRooms = [], isLoading } = useQuery({
        queryKey: ['popular-rooms'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/popular-rooms')
            return data
        },
    })
    return { popularRooms, isLoading }
}

export default usePopularRooms