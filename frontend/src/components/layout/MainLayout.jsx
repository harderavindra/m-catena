import React, { useContext } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { FiChevronLeft, FiGrid, FiUser, FiLogOut } from "react-icons/fi";
import logoImage from '../../assets/m-logo.svg'
import { useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext'
import avatarPlaceholder from "../../assets/avatar-placeholder.png"

const MainLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const [expanded, setExpanded] = useState(false)
    return (
        <div className='flex bg-gray-50 min-h-screen'>
            <div className={`bg-white transition-all duration-300 ease-in-out shadow-md ${expanded ? 'w-56' : 'w-16'}`}>
                <a href='' className='py-4 px-2 flex justify-center gap-2'><img src={logoImage} width='40' />
                    {expanded && (<span className='text-2xl font-bold'> Catena</span>)}
                </a>
                <div className='py-2 flex items-center justify-end border-t border-b border-gray-200' onClick={() => setExpanded((prev) => !prev)}><FiChevronLeft className={`transition-transform duration-300 ${expanded ? "rotate-0" : "rotate-180"} `} /></div>
                <ul className='flex flex-col gap-2'>
                    <li>
                        <NavLink to={'/dashboard'} className={({ isActive }) => `${isActive ? 'text-red-400 ' : 'text-gray-700'} flex text-nowrap py-2 px-4  gap-2 `} ><FiGrid size={24} />
                            {
                                expanded && (<span className={`transition-opacity duration-300 ${expanded ? "opacity-100 visible" : 'opacity-0 invisible'}`}>Brand Treasury</span>)
                            }
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to={'/users'} className={({ isActive }) => `${isActive ? 'text-red-400 ' : 'text-gray-700'} flex text-nowrap py-2 px-4  gap-2 `} ><FiUser size={24} />
                            {
                                expanded && (<span className={`transition-opacity duration-300 ${expanded ? "opacity-100 visible" : 'opacity-0 invisible'}`}>Users
                                </span>)
                            }
                        </NavLink>
                    </li>
                </ul>
                <ul>

                    {user &&
                        (<li className='flex  gap-2 px-4 py-2 items-center'>
                            <NavLink to={'/profile'} className={`flex gap-2`}>
                                <img src={avatarPlaceholder} className='w-8 min-w-8 h-8 rounded-full object-cover' />
                                {expanded && <div className='flex flex-col =gap-[4] leading-none	'>{user.firstName}<p className='capitalize p-0 text-gray-400'>{user.role.toLowerCase()}</p></div>}
                            </NavLink>
                        </li>)
                    }
                    <li className='flex  gap-2 px-4 py-2 items-center cursor-pointer' onClick={logout}><FiLogOut size={24} />
                        {expanded && 'Logout'}
                    </li>

                </ul>
            </div>
            <main className='border border-gray-200 w-full p-5  '>
                <Outlet />
            </main>
            t</div>
    )
}

export default MainLayout