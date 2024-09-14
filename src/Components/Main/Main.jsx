import React, { useState, useRef, useContext, useReducer, useEffect } from 'react';
import { Avatar, Button } from '@mui/material';
import avatar from '../../assets/images/avatar.jpg';
import smile from '../../assets/images/smile.png';
import live from '../../assets/images/live.png';
import addImage from '../../assets/images/add-image.png';
import { AuthContext } from '../AppContext/AppContext';
import { doc, setDoc, collection, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase/firebase';
import { PostsReducer, postActions, postsState } from '../AppContext/PostReducer';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Alert from '@mui/material/Alert';
import PostCard from './PostCard';

const Main = () => {
    const { user, userData } = useContext(AuthContext);
    const text = useRef("");
    const scrollRef = useRef(null); // Asegúrate de que sea null inicialmente
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const collectionRef = collection(db, "posts");
    const postRef = doc(collection(db, "posts"));
    const document = postRef.id;
    const [state, dispatch] = useReducer(PostsReducer, postsState);
    const { SUBMIT_POST, HANDLE_ERROR } = postActions;
    const [progressBar, setProgressBar] = useState(0);

    const handleUpload = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        if (text.current.value !== "") {
            try {
                await setDoc(postRef, {
                    documentId: document,
                    uid: user?.uid || userData?.uid,
                    logo: user?.photoURL,
                    name: user?.displayName || userData?.name,
                    email: user?.email || userData?.email,
                    text: text.current.value,
                    image: image,
                    timestamp: serverTimestamp(),
                });

                text.current.value = "";
            } catch (err) {
                dispatch({ type: HANDLE_ERROR });
                alert(err.message);
                console.log(err.message);
            }
        } else {
            dispatch({ type: HANDLE_ERROR });
        }
    };

    const storage = getStorage();

    const submitImage = async () => {
        if (!file) {
            return;
        }
        
        const metadata = {
            contentType: file.type,
        };
        
        try {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);
            uploadTask.on('state_changed', (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgressBar(progress);
            }, 
            (error) => {
                alert(error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setImage(downloadURL);
            });
        } catch (err) {
            dispatch({ type: HANDLE_ERROR });
            alert(err.message);
            console.log(err.message);
        }
    };

    useEffect(() => {
        const postData = async () => {
            try {
                const q = query(collectionRef, orderBy("timestamp", "asc"));
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const posts = snapshot.docs.map((doc) => doc.data());
                    dispatch({
                        type: SUBMIT_POST,
                        posts: posts,
                    });
                    if (scrollRef.current && typeof scrollRef.current.scrollIntoView === 'function') {
                        scrollRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                    setImage(null);
                    setFile(null);
                    setProgressBar(0);
                });
                return unsubscribe;
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        postData();
    }, [SUBMIT_POST]);

    return (
        <div className='flex flex-col items-center'>
            <div className='flex flex-col py-4 w-full bg-white rounded-3xl shadow-lg'>
                <div className='flex items-center border-b-2 border-gray-300 pb-4 pl-4 w-full'>
                    <Avatar 
                        sx={{width: 24, height:24}}
                        variant='circular' 
                        src={user?.photoURL || avatar} 
                        alt='avatar'>
                    </Avatar>
                    <form className='w-full' onSubmit={handleSubmitPost}>
                        <div className='flex justify-between items-center'>
                            <div className='w-80 ml-4'>
                                <input 
                                    type='text'
                                    name='text' 
                                    placeholder={`What’s on your mind ${
                                        user?.displayName?.split(" ")[0] || 
                                        userData?.name?.charAt(0).toUpperCase() + 
                                        userData?.name?.slice(1)
                                    }`}
                                    className='outline-none w-full bg-white rounded-md p-2'
                                    ref={text}
                                />
                            </div>
                            <div className='mx-4'>
                                {image && <img src={image} alt="previewImage" className='h-24 rounded-xl' />}
                            </div>
                            <div className='pr-4'>
                                <Button variant='text' type='submit' size='small' onClick={submitImage}>
                                    Share
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
                <span style={{ width: `${progressBar}%` }} className='bg-blue-700 py-1 rounded-md'></span>
                <div className='flex justify-around items-center pt-4'>
                    <div className='flex items-center'>
                        <label 
                            htmlFor="addImage" 
                            className='cursor-pointer flex items-center'>
                            <img className='h-8 mr-4' src={addImage} alt="addImage" />
                            <input 
                                id='addImage' 
                                type="file" 
                                style={{ display: 'none' }}
                                onChange={handleUpload}
                            />
                        </label>
                        {file && <Button variant='text' onClick={submitImage}>Upload</Button>}
                    </div>
                    <div className='flex items-center'>
                        <img className='h-8 mr-4' src={live} alt="live" />
                        <p className='font-Poppins font-medium text-sm text-gray-700 no-underline tracking-normal leading-none'>
                            Live
                        </p>
                    </div>
                    <div className='flex items-center'>
                        <img className='h-8 mr-4' src={smile} alt="feeling" />
                        <p className='font-Poppins font-medium text-sm text-gray-700 no-underline tracking-normal leading-none'>
                            Feeling
                        </p>
                    </div>
                </div>
            </div>
            <div className='flex flex-col py-4 w-full'>
                {state.error ? (
                    <div className='flex justify-center items-center'>
                        <Alert severity="error">
                            Something went wrong refresh and try again...
                        </Alert>
                    </div>
                ) : (
                    <div>
                        {state.posts.length > 0 && state.posts.map((post, index) => (
                            <PostCard 
                                key={index} 
                                logo={post.logo} 
                                id={post.documentId}
                                uid={post.uid}
                                name={post.name}
                                email={post.email}
                                image={post.image}
                                text={post.text}
                                timestamp={new Date(
                                    post?.timestamp?.toDate()
                                )?.toUTCString()}
                            ></PostCard>
                        ))}
                    </div>
                )}
            </div>
            <div ref={scrollRef}></div>
        </div>
    );
};

export default Main;
