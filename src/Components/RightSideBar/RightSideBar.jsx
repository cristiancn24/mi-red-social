import React, { useContext, useState } from 'react';
import waterslide from "../../assets/images/waterslide.jpg";
import { AuthContext } from '../AppContext/AppContext';
import { Link } from 'react-router-dom';
import { Avatar } from '@mui/material';
import avatar from '../../assets/images/avatar.jpg';
import { MdDeleteForever } from "react-icons/md";
import { collection, query, updateDoc, where, doc, getDocs, arrayRemove } from 'firebase/firestore';
import { db } from '../Firebase/firebase';

const RightSideBar = () => {
    const [input, setInput] = useState('');
    const { user, userData } = useContext(AuthContext);
    const friendList = userData?.friends || [];

    const searchFriends = (data) => {
        return data.filter((item) => 
            item.name.toLowerCase().includes(input.toLowerCase())
        );
    };

    const removeFriend = async (id, name, image) => {
        try {
            const q = query(collection(db, "users"), where('uid', '==', user?.uid));
            const getDoc = await getDocs(q);
            const userDocumentId = getDoc.docs[0].id;

            await updateDoc(doc(db, 'users', userDocumentId), {
                friends: arrayRemove({ id: id, name: name, image: image }),
            });
        } catch (err) {
            console.error(err.message);
            alert(err.message);
        }
    };

    return (
        <div className='flex flex-col h-screen bg-white shadow-lg border-2 rounded-l-xl'>
            <div className='flex flex-col items-center relative pt-0'>
                <img className='h-48 rounded-md' src={waterslide} alt="nature" />
            </div>
            <p className='font-Poppins font-thin text-xs text-gray-500 max-w-fit no-underline tracking-normal leading-tight py-2 mx-2 '>
                Trough photography, the beauty of Mother Nature can be frozen in time.
                This category celebrates the magic of our planet and beyond - from the
            </p>
            <div className='mx-2 mt-5'>
                <p className='font-Poppins font-thin text-sm text-gray-500 no-underline tracking-normal leading-none text-left'>
                    Friends: {" "}
                </p>
                <input 
                    className='border-0 outline-none flex mt-3 text-sm'
                    name='input' 
                    value={input} 
                    type='text' 
                    placeholder="Search Friends " 
                    onChange={(e) => setInput(e.target.value)}
                />
                {friendList.length > 0 ? searchFriends(friendList).map((friend) => (
                    <div className='flex items-center justify-between hover:bg-gray-100 duration-300 ease-in-out' key={friend.id}>
                        <Link to="">
                            <div className='flex items-center my-2 cursor-pointer'>
                                <div className='flex items-center'>
                                    <Avatar sx={{ width: 24, height: 24 }} src={friend.image || avatar}></Avatar>
                                    <p className='ml-4 font-Poppins font-thin text-sm text-gray-500 no-underline tracking-normal leading-none'>
                                        {friend.name}
                                    </p>
                                </div>
                            </div>
                        </Link>
                        <div className='mr-4'>
                            <MdDeleteForever 
                                className='h-8 mr-4 cursor-pointer' 
                                onClick={() => removeFriend(friend.id, friend.name, friend.image)}
                            />
                        </div>
                    </div>
                )) : (
                    <p className='mt-10 font-Poppins font-thin text-sm text-gray-500 no-underline tracking-normal leading-none'>
                        Add friends to see their profile
                    </p>
                )}
            </div>
        </div>
    );
};

export default RightSideBar;
 