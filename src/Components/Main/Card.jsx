import React from 'react'

const Card = ({name, img, status}) => {
  return (
    <div>
        <div className='relative'>
            <img className='h-72 w-56 rounded-3xl hover:scale-105 duration-700 ease-in-out cursor-pointer shadow-lg' 
            src={img} 
            alt={name} />
            <p className='absolute bottom-4 left-2 text-xs font-medium text-white font-Poppins no-underline leading-none'>
                {name}
            </p>
            <p className={`${status === "Offline" ? "absolute bottom-4 right-4 text-xs font-medium text-red-600 font-Poppins no-underline leading-none" 
                : "absolute bottom-4 right-4 text-xs font-medium text-green-600 font-Poppins no-underline leading-none"}`}>
                    {status}

            </p>
        </div>
    </div>
  )
}

export default Card