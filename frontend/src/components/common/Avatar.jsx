import React from 'react'
import avatarPlaceholder from "../../assets/avatar-placeholder.png"

const Avatar = ({className, size="sm"}) => {
    const sizes ={
        sm:'w-8 h-8',
        md:'w-12 h-12',
        lg:'w-20 h-20',
        xl:'w-30 h-30',
        
    
    }
  return (
    <div className='inline-block'>
       <img src={avatarPlaceholder} className={`${sizes[size]} rounded-full object-cover ${className}`} />
    </div>
  )
}

export default Avatar