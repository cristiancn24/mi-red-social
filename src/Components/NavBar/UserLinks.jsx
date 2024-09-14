import React, { useContext } from 'react';
import { Tooltip, Avatar } from "@mui/material";
import avatar from "../../assets/images/avatar.jpg";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegBell, FaRegUser } from "react-icons/fa";
import { AuthContext } from '../AppContext/AppContext';

const UserLinks = () => {
  const { signOutUser, user, userData } = useContext(AuthContext);

  // Función para obtener el nombre de usuario formateado correctamente
  const getDisplayName = () => {
    if (user?.displayName) {
      return user.displayName.split(' ')[0];
    } else if (userData?.name) {
      return userData.name.charAt(0).toUpperCase() + userData.name.slice(1);
    }
    return '';
  };

  return (
    <div className='flex justify-center items-center cursor-pointer'>
      <FaRegUser className='size-5 hover:translate-y-1 duration-500 ease-in-out hover:text-blue-500'/>
      <IoSettingsOutline className='size-6 mx-4 hover:translate-y-1 duration-500 ease-in-out hover:text-blue-500'/>
      <FaRegBell className='size-5 hover:translate-y-1 duration-500 ease-in-out hover:text-blue-500'/>

      <div className='mx-4 flex items-center' onClick={signOutUser}>
        <Tooltip title= "Sign Out" placement= "bottom">
          <Avatar src={user?.photoURL || avatar} size="sm" alt='avatar'/>
        </Tooltip>
        <p className='ml-4 font-Poppins text-sm text-black font-medium no-underline'>
          {getDisplayName()}
        </p>
      </div>
    </div>
  );
};

export default UserLinks;
