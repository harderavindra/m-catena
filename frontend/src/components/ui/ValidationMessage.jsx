import React from 'react'

const ValidationMessage = ({variant='error', children}) => {
  return (
    <p className={`${variant==='error'? 'text-red-400':'text-green-400'}`}>{children}</p> 
  )
}

export default ValidationMessage