import React, {useRef, useState, useEffect, useContext} from 'react'
import nature from "../../assets/images/nature.jpg";
import { Tooltip, Avatar } from "@mui/material";
import avatar from "../../assets/images/avatar.jpg";
import job from "../../assets/images/job.png";
import location from "../../assets/images/location.jpg";
import facebook from "../../assets/images/facebook.png";
import twitter from "../../assets/images/twitter.png";
import laptop from "../../assets/images/laptop.png";
import media from "../../assets/images/media.png";
import apps from "../../assets/images/apps.jpg";
import tik from "../../assets/images/tik.jpg";
import { AuthContext } from '../AppContext/AppContext';

const LeftSideBar = () => {

    const [data, setData] = useState([]);
    const count = useRef(0);
    const {user, userData} = useContext(AuthContext);
    

    const handleRandom = (arr) => {
        setData(arr[Math.floor(Math.random() * arr?.length)]);
    }


    useEffect(() => {
        const imageList = [
            {
            id: "1",
            image:laptop,
            },
            {
            id: "2",
            image:media,
             },
            {
            id: "3",
            image:apps,
            },
            {
            id: "4",
             image:tik,
             },
    ];
    handleRandom(imageList);
    let countAds = 0; 
    let startAds = setInterval(() => {
        countAds++;
        handleRandom(imageList);
        count.current = countAds;
        if(countAds === 5){
            clearInterval(startAds);
        }
    }, 2000);

    return () => {
        clearInterval(startAds);
    }
}, []);





  return (
    <div className='flex flex-col h-screen bg-white pb-4 border-2 rounded-r-xl shadow-lg '>
        <div className='flex flex-col items-center relative'>
            <img 
            className='h-28 w-full rounded-r-xl' 
            src={nature} 
            alt="nature" />
            <div className='absolute-bottom-4 '>
            <Tooltip content='Profile' placement='top'>
                <Avatar src={user?.photoURL || avatar} alt='avatar'></Avatar>
            </Tooltip>
        </div>
        </div> 
        <div className='flex flex-col items-center pt-1'>
            <p className='font-Poppins font-medium text-md text-gray-500 no-underline tracking-normal leading-none'>
                {user?.email || userData?.email}
            </p>
            <p className='font-Poppins font-medium text-xs text-gray-500 no-underline tracking-normal leading-none'>
                Access exclusive tools & insights
            </p>
            <p className='font-Poppins font-medium text-sm text-gray-500 no-underline tracking-normal leading-none'>
                Try premium for free
            </p>
        </div>
        <div className='flex flex-col pl-2'>
        <div className='flex items-center pb-4'>
            <img className='h-10' src={location} alt="location" />
            <p className='font-Poppins font-thin text-lg no-underline tracking-normal leading-none'>
                Bonao
                </p>
            </div>
            <div className='flex items-center '>
            <img className='h-10' src={job} alt="job" />
            <p className='font-Poppins font-thin text-lg no-underline tracking-normal leading-none ml-3'>
                React Developer
                </p>
            </div>
            <div className='flex justify-center items-center pt-4'>
                <p className='font-Poppins font-thin text-sm text-[#0177b7] no-underline tracking-normal leading-none'>
                    Events
                </p>
                <p className='font-Poppins font-thin text-sm text-[#0177b7] no-underline tracking-normal leading-none mx-2'>
                    Groups
                </p>
                <p className='font-Poppins font-thin text-sm text-[#0177b7] no-underline tracking-normal leading-none'>
                    Follow
                </p>
                <p className='font-Poppins font-thin text-sm text-[#0177b7] no-underline tracking-normal leading-none mx-2'>
                    More
                </p>
            </div>
        </div>
        <div className='ml-2'>
            <p className='font-Poppins font-thin text-lg no-underline tracking-normal leading-none py-2 text-left'>
                Social Profiles
            </p>
            <div className='flex items-center'>
                <img className='h-5 mb-0 mr-3' src={facebook} alt="facebook" />
                <p className='font-Poppins font-thin text-lg text-transparent bg-clip-text bg-gradient-to-r to-red-700 from-blue-500 no-underline tracking-normal leading-none py-2'>
                    Social Network
                </p>
            </div>
            <div className='flex items-center'>
                <img className='h-5 mb-0 mr-2' src={twitter} alt="twitter" />
                <p className='font-Poppins font-thin text-lg text-transparent bg-clip-text bg-gradient-to-r to-red-700 from-blue-500 no-underline tracking-normal leading-none py-2'>
                    Social Network
                </p>
            </div> 
        </div>
        <div className='flex flex-col justify-center items-center pt-4'>
            <p className='font-Poppins font-thin text-lg no-underline tracking-normal leading-none py-2 '>
                Random Ads
            </p>
            <div 
            className='bg-transparent rounded-xl h-1 mb-4'>
                <img className='h-36 rounded-lg pt-4' src={data.image} alt="ads" />
            </div>
        </div>
    </div>
  )
}


export default LeftSideBar