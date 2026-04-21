// client/src/hooks/useCategories.js
import { useQuery } from '@tanstack/react-query'
import useAxiosCommon from './useAxiosCommon'
import {
    TbBeach, TbMountain, TbPool,
} from 'react-icons/tb'
import {
    GiBarn, GiBoatFishing, GiCactus, GiCastle,
    GiCaveEntrance, GiForestCamp, GiIsland, GiWaterfall, GiWindmill,
} from 'react-icons/gi'
import { FaCity, FaLandmark, FaMountain, FaPaw, FaSkiing, FaUmbrellaBeach } from 'react-icons/fa'
import { BsSnow } from 'react-icons/bs'
import { IoDiamond } from 'react-icons/io5'
import { MdOutlineVilla } from 'react-icons/md'

// Map icon string names → actual components
export const iconMap = {
    TbBeach, TbMountain, TbPool,
    GiBarn, GiBoatFishing, GiCactus, GiCastle,
    GiCaveEntrance, GiForestCamp, GiIsland, GiWindmill,
    FaSkiing, BsSnow, IoDiamond, MdOutlineVilla, FaUmbrellaBeach, FaMountain, FaCity, FaPaw, GiWaterfall, FaLandmark
}

const useCategories = () => {
    const axiosCommon = useAxiosCommon()
    const { data: categories = [], isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await axiosCommon.get('/categories')
            // Attach actual icon component
            return data.map(cat => ({
                ...cat,
                icon: iconMap[cat.icon] || TbBeach,
            }))
        },
    })
    return [categories, isLoading]
}

export default useCategories