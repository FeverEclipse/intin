import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar.jsx';
import PostCell from './PostCell.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const Posts = () => {
    const [posts, setPosts] = useState([]);
    

    useEffect( () => {

        const fetchAllPosts = async () => {
            try{
                const res = await axios.get(process.env.REACT_APP_BACKEND_URL + "/posts");
                setPosts(res.data);
            }catch(e){
                console.log(e);
            }
        }
        fetchAllPosts();
        
    },[])
    return(
        <div className='mt-2 divide-y-2'>
            {posts.map((post) => (
                <PostCell key={post.idEntry} idEntry={post.idEntry} title= {post.Title} username= {post.username} content= {post.Content} date= {post.date} userid={post.userId}   />
            ))}
        </div>
    )
}


function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    axios.defaults.withCredentials = true;
    const navigator = useNavigate();
    useEffect(() => {
        const fetchAuthStatus = async () => {
            try{
                const res = await axios.get(process.env.REACT_APP_BACKEND_URL);
                if(res.data.valid){
                    setIsLoggedIn(true);
                    setUserId(res.data.userId);
                    setUsername(res.data.username);
                }else{
                    setIsLoggedIn(false);
                }
            }catch(e){
                console.log(e);
            }
        }
        fetchAuthStatus();
    }, [])

    const handlePost = async (e) => {
        e.preventDefault();
        if(userId){
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/post', {title: postTitle, content: postContent, userId: userId}, {headers: {'Content-Type': 'application/json'}});
        if(response.data.Success){
            window.location.reload();
        }else{
            console.log(response.data.Message);
        }
        }
        else{
            navigator("/login");
        }
    }
  return (
    <div className='flex'>
        <Sidebar isLoggedIn={isLoggedIn} username={username} />
        <div className='min-w-60'></div>
        <div className='p-4 pt-0 w-full'>
            <div className='w-full fixed bg-white z-10'>
            <h1 className='w-full bg-white mt-4 font-inter text-onyx text-3xl'>Ana Sayfa</h1>
            </div>
            <div className='overflow-y-scroll'>
            <div className='w-full mt-20 p-2 border-1 rounded-md'>
            <h1 className='font-inter text-onyx text-xl'>Soru Oluştur</h1>
                <input className='w-full min-h-12 p-1 h-2 font-inter' placeholder='Soru Başlığı' value={postTitle} onChange={e => setPostTitle(e.target.value)} />
                <hr></hr>
                <input className=' mt-1 w-full min-h-24 p-1 font-inter' placeholder='Açıklama' value={postContent} onChange={e => setPostContent(e.target.value)} />
                <button className='w-32 mt-2 h-12 rounded-md bg-onyx opacity-70 hover:opacity-100 text-white font-inter duration-200' onClick={handlePost}>Yayınla</button>
            </div>
            <h1 className='font-inter text-onyx text-xl mt-3'>Tüm Sorular</h1>
            <Posts/>
            </div>
            
        </div>
        <div className='min-w-60'></div>
        
    </div>
  )
}

export default Home