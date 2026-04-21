import { FaUserCog, FaListAlt } from 'react-icons/fa'
import MenuItem from './MenuItem'

const AdminMenu = () => {
    return (
        <>
            <MenuItem icon={FaUserCog} label='Manage Users' address='manage-users' />
            <MenuItem
                icon={FaListAlt}
                label='Manage Categories'
                address='manage-categories'
            />
        </>
    )
}

export default AdminMenu