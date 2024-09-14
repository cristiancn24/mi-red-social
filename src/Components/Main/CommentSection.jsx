import React, { useContext, useRef, useReducer, useEffect } from 'react';
import { Avatar } from '@mui/material';
import avatar from '../../assets/images/avatar.jpg';
import { AuthContext } from '../AppContext/AppContext';
import { setDoc, collection, doc, serverTimestamp, orderBy, query, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import { PostsReducer, postActions, postsState } from '../AppContext/PostReducer';

const CommentSection = ({ postId }) => {
    const comment = useRef('');
    const { user, userData } = useContext(AuthContext);
    const [state, dispatch] = useReducer(PostsReducer, postsState);
    const { ADD_COMMENT, HANDLE_ERROR } = postActions;

    const addComment = async (e) => {
        e.preventDefault();
        if (comment.current.value !== '') {
            const commentRef = doc(collection(db, 'posts', postId, 'comments'));
            try {
                await setDoc(commentRef, {
                    id: commentRef.id,
                    comment: comment.current.value,
                    image: user?.photoURL,
                    name:
                        user?.displayName?.split(' ')[0] ||
                        userData?.name?.charAt(0)?.toUpperCase() +
                        userData?.name?.slice(1),
                    timestamp: serverTimestamp(),
                });
                comment.current.value = '';
            } catch (err) {
                dispatch({ type: HANDLE_ERROR });
                alert(err.message);
                console.log(err.message);
            }
        }
    };

    useEffect(() => {
        const getComments = async () => {
            try {
                const collectionOfComments = collection(db, `posts/${postId}/comments`);
                const q = query(collectionOfComments, orderBy('timestamp', 'desc'));
                await onSnapshot(q, (snapshot) => {
                    const comments = snapshot.docs.map((doc) => doc.data());
                    dispatch({ type: ADD_COMMENT, comments: comments });
                });
            } catch (err) {
                dispatch({ type: HANDLE_ERROR });
                alert(err.message);
                console.log(err.message);
            }
        };
        getComments();
    }, [postId, ADD_COMMENT, HANDLE_ERROR]);

    return (
        <div className='flex flex-col bg-white w-full py-2 rounded-b-3xl'>
            <div className='flex items-center'>
                <div className='mx-2'>
                    <Avatar sx={{width: 24, height:24}} src={user?.photoURL || avatar}></Avatar>
                </div>
                <div className='w-full pr-2'>
                    <form className='flex items-center w-full' onSubmit={addComment}>
                        <input name='comment' type='text' className='w-full rounded-2xl outline-none border-2 p-2 bg-gray-100' placeholder='Write a comment...' ref={comment}></input>
                        <button className='hidden' type='submit'></button>
                    </form>
                </div>
            </div>
            {/* Render comments */}
            {state.comments?.map((comment, index) => (
                <div key={index} className='flex items-center my-2 mx-2'>
                    <Avatar sx={{width: 24, height:24}} src={comment.image || avatar} className='mr-2'></Avatar>
                    <div className='flex flex-col text-justify'>
                        <span className='font-medium'>{comment.name}</span>
                        <span className='w-full rounded-2xl outline-none border-0 p-2 bg-gray-100'>{comment.comment}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CommentSection;
