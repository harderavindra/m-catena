import React from 'react'
import { FiCheck, FiClock, FiEyeOff, FiStar } from 'react-icons/fi'

const StatusBubble = ({status ='success',icon,  size= 'sm', className}) => {
    const statusStyles = {
        success: {
            background: "#43AF7A",
            boxShadow: "-3px 4px 9px 0px rgba(67, 175, 122, 0.60)",
          },
          error: {
            background: "#FD5D5D",
            boxShadow: "-3px 4px 9px 0px rgba(253, 93, 93, 0.60)",
          },
    }
    const sizes = {
        sm: 14,
        md: 18,
        lg:24
    }
    const statusIcons = {
        star: <FiStar size={sizes[size]}/>,
        check: <FiCheck size={sizes[size]}/>,
        eyeOff: <FiEyeOff size={sizes[size]}/>,
        clock: <FiClock size={sizes[size]}/>,

    }
   
  return (
    <button className={`rounded-full p-1 text-white green-status green-shadow-md ${className}`}
    style={{
        background: statusStyles[status]?.background,
        boxShadow: statusStyles[status]?.boxShadow,
    }}
    >{statusIcons[icon]}</button>
  )
}

export default StatusBubble