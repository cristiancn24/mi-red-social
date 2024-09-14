import React from 'react';
import { Avatar } from '@mui/material';
import avatar from '../../assets/images/avatar.jpg';

const Comment = (name, comment, image) => {
  return (
    <div className='flex items-center mt-2 w-full'>
        <div className='mx-2'>
            <Avatar sx={{width: 24, height: 24}} alt='avatar' src={image || avatar}></Avatar>
        </div>
        <div className='flex flex-col items-start bg-gray-100 rounded-2xl p-1 max-w-[600px]'>
            <p className='font-Poppins font-thin text-black text-sm no-underline tracking-normal leading-none p-1'>{name}</p>
            <p className='font-Poppins font-thin text-black text-sm no-underline tracking-normal leading-none p-1'>{comment}</p>
        </div>
    </div>
  )
}

export default Comment