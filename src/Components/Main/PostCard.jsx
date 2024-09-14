import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Avatar } from '@mui/material';
import avatar from '../../assets/images/avatar.jpg';
import { BiLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AuthContext } from '../AppContext/AppContext';
import { PostsReducer, postActions, postsState } from '../AppContext/PostReducer';
import { doc, deleteDoc, setDoc, collection, query, onSnapshot, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import { IoPersonAddSharp } from "react-icons/io5";
import CommentSection from './CommentSection';

const PostCard = ({ uid, id, logo, name, text, image, timestamp, email }) => {
    const { user } = useContext(AuthContext);
    const [state, dispatch] = useReducer(PostsReducer, postsState);
    const singlePostDocument = doc(db, "posts", id);
    const { ADD_LIKE, HANDLE_ERROR } = postActions;
    const [open, setOpen] = useState(false);

    const handleOpen = (e) => {
        e.preventDefault();
        setOpen(true);
    };

    const addUser = async () => {
        try {
            const q = query(collection(db, "users"), where('uid', '==', user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].ref;
            await updateDoc(data, {
                friends: arrayUnion({
                    id: uid,
                    name: name,
                    image: logo,
                }),
            });
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleLike = async (e) => {
        e.preventDefault();
        const q = query(collection(db, "posts", id, "likes"), where('uid', '==', user?.uid));
        const querySnapshot = await getDocs(q);
        try {
            if (!querySnapshot.empty) {
                const likeDocId = querySnapshot.docs[0].id;
                const deleteId = doc(db, 'posts', id, 'likes', likeDocId);
                await deleteDoc(deleteId);
            } else {
                const likeRef = doc(collection(db, "posts", id, "likes"));
                await setDoc(likeRef, {
                    uid: user?.uid,
                });
            }
        } catch (err) {
            alert(err.message);
            console.log(err.message);
        }
    };

    const deletePost = async (e) => {
        e.preventDefault();
        try {
            if (user?.uid === uid) {
                await deleteDoc(singlePostDocument);
                console.log('Post deleted');
            } else {
                console.log('You cannot delete this post');
                throw new Error('You cannot delete this post');
            }
        } catch (err) {
            alert(err.message);
            console.log(err.message);
        }
    };

    useEffect(() => {
        const getLikes = async () => {
            try {
                const q = collection(db, "posts", id, "likes");
                await onSnapshot(q, (snapshot) => {
                    dispatch({ type: ADD_LIKE, likes: snapshot.docs.map((doc) => doc.data()) });
                });
            } catch (err) {
                dispatch({ type: HANDLE_ERROR });
                alert(err.message);
                console.log(err.message);
            }
        };
        getLikes();
    }, [id, ADD_LIKE, HANDLE_ERROR]);

    return (
        <div className='mb-4'>
            <div className='flex flex-col py-4 bg-white rounded-t-3xl'>
                <div className='flex items-center pb-4 ml-2'>
                    <Avatar sx={{ width: 36, height: 36 }} src={logo || avatar} alt='avatar'></Avatar>
                    <div className='flex flex-col'>
                        <p className='ml-4 py-2 font-Poppins font-medium text-sm text-gray-500 no-underline tracking-normal leading-none text-justify'>
                            {email}
                        </p>
                        <p className='ml-4 py-2 font-Poppins font-medium text-sm text-gray-500 no-underline tracking-normal leading-none'>
                            Published: {timestamp}
                        </p>
                    </div>
                    {user?.uid !== uid && <div onClick={addUser} className='w-full flex justify-end cursor-pointer mr-10 text-4xl'>
                        <IoPersonAddSharp className='hover:bg-blue-100 rounded-xl p-2' />
                    </div>}
                </div>
                <div>
                    <p className='ml-4 pb-4 font-Poppins font-medium text-sm text-gray-500 no-underline tracking-normal leading-none text-justify'>
                        {text}
                    </p>
                    {image && (
                        <img className='h-[500px] w-full' src={image} alt='postImage'></img>
                    )}
                </div>
                <div className='flex justify-around items-center pt-4'>
                    <div className='flex items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100' onClick={handleLike}>
                        <BiLike className='h-8 mr-4' />
                        {state.likes?.length > 0 && state?.likes?.length}
                    </div>
                    <div className='flex justify-around items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100' onClick={handleOpen}>
                        <div className='flex items-center cursor-pointer'>
                            <FaRegComment className='h-8 mr-4' />
                            <p className='font-Poppins font-thin text-md text-gray-500 no-underline tracking-normal leading-none'>Comments</p>
                        </div>
                    </div>
                    <div className='flex justify-around items-center cursor-pointer rounded-lg p-2 hover:bg-gray-100' onClick={deletePost}>
                        <div className='flex items-center cursor-pointer'>
                            <MdDeleteForever className='h-8 mr-4' />
                            <p className='font-Poppins font-thin text-md text-gray-500 no-underline tracking-normal leading-none'>Delete</p>
                        </div>
                    </div>
                </div>
            </div>
            {open && <CommentSection postId={id}></CommentSection>}
        </div>
    );
}

export default PostCard;
