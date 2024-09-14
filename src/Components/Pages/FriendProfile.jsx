import React from 'react';
import Navbar from '../NavBar/Navbar';
import LeftSideBar from '../LeftSideBar/LeftSideBar';
import RightSideBar from '../RightSideBar/RightSideBar';
import { CardSection } from '../Main/CardSection';
import Main from '../Main/Main';
import profilePic from '../../assets/profilePic.jpg';

const FriendProfile = () => {
  return (
    <div className='w-full'>
      <div className='fixed top-0 z-10 w-full bg-white'>
        <Navbar></Navbar>
      </div>
      <div className='flex gb-gray-100'>
        <div className='flex-auto w-[20%] fixed top-14'>
          <LeftSideBar></LeftSideBar>
        </div>
        <div className='flex-auto w-[60%] absolute left-[20%] top-14 bg-gray-100 rounded-xl'>
          <div className='w-[85%] mx-auto'>
            <div>
                <div className='relative py-4'>
                    <img src={profilePic} alt="profilePic" />
                </div>
            </div>
          <CardSection></CardSection>
          <Main></Main>
          </div>
        </div>
        <div className='flex-auto w-[20%] fixed right-0 top-14'>
          <RightSideBar></RightSideBar>
        </div>
      </div>
    </div>
  );
}

export default FriendProfile