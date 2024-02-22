/* eslint-disable no-restricted-globals */
import {React, useState, useEffect} from 'react';
import Sidebar from './Sidebar.jsx';
import axios from 'axios';
import PostCell from './PostCell.jsx';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [posts, setPosts] = useState([]);
    const [creationDate, setCreationDate] = useState('');
    const [photoId, setPhotoId] = useState('');
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    useEffect(() => {
        const fetchAuthStatus = async () => {
            try{
                const res = await axios.get(process.env.REACT_APP_BACKEND_URL);
                if(res.data.valid){
                    setIsLoggedIn(true);
                    setUsername(res.data.username);
                    setUserId(res.data.userId);
                    setCreationDate(res.data.creation_date);
                    setPhotoId(res.data.photoId);
                }else{
                    setIsLoggedIn(false);
                }
            }catch(e){
                console.log(e);
            }
        }
        fetchAuthStatus();
      }, []);

      useEffect(() => {
        const fetchUserPosts = async () => {
            try{
                const res = await axios.post(process.env.REACT_APP_BACKEND_URL + "/profile", {userId: userId}, {headers: {'Content-Type': 'application/json'}});
                setPosts(res.data);
            }catch(e){
                console.log(e);
            }
        }
        fetchUserPosts();
      }, [userId])

        axios.defaults.withCredentials = true;
        const handleLogOut = () => {
        axios.post(process.env.REACT_APP_BACKEND_URL + "/logout", {}, {withCredentials: true})
        .then(res => {
                location.reload(true);
                navigate("/")
        }).catch(err => console.log(err));
        }
      const handleDelete = async (e) => {
        e.preventDefault();
        const res = await axios.post(process.env.REACT_APP_BACKEND_URL + "/deleteuser", {}, {headers: {'Content-Type': 'application/json'}});
        if (res.data.Success){
            handleLogOut();
            navigate("/");
        }else{
            console.log(res.data.Message);
        }
      };

      let jsDate = new Date(creationDate);
      let formattedDate = jsDate.getDate () + "." + (jsDate.getMonth () + 1) + "." + jsDate.getFullYear () + " " + jsDate.getHours () + ":" + jsDate.getMinutes ();
  return (
    <div className='flex'>
        <Sidebar isLoggedIn={isLoggedIn} username={username} />
        <div className='min-w-60'></div>
        <div className='p-4 pt-0 w-full'>
            <div className='w-full fixed bg-white z-10'>
            <h1 className='w-full bg-white mt-4 font-inter text-onyx text-3xl'>Profil</h1>
            </div>
            <div className='flex w-full mt-24 gap-x-3'>
                <img className='min-w-fit' src='/assets/Profile.png'></img>
                <div className='min-w-fit'>
                    <h1 className='font-inter text-md min-h-fit'>{username}</h1>
                    <h1 className='font-inter_regular text-sm min-h-fit'>{formattedDate} Tarihinde katıldı.</h1>
                </div>
                <div className='w-full'></div>
                <button onClick={handleDelete} className=' min-w-28 h-10 text-red flex gap-x-1 ps-1 pt-2 rounded-md hover:bg-gray-200 duration-200'><img className='w-6 h-6' alt='Delete Icon' src='/assets/Delete.png'></img><p>Hesabı Sil</p></button>
            </div>
            <hr></hr>
            <div className='flex w-full'>
                <Link className='text-black w-full' to={"/profile/"}>
                    <button className='w-full rounded-md border-2 font-inter h-8'>Gönderiler</button>
                </Link>
                <Link className='text-black w-full' to={"/profile/likes"}>
                    <button className='w-full rounded-md border-0 font-inter h-8'>Beğeniler</button>
                </Link>
            </div>
            <div className='mt-2 divide-y-2'>
            {posts.map((post) => (
                <PostCell key={post.idEntry} idEntry={post.idEntry} title= {post.Title} username= {post.username} content= {post.Content} date= {post.date} userid={post.userId}   />
            ))}
        </div>
        </div>
        <div className='min-w-60'></div>
    </div>
  )
}

export default Profile