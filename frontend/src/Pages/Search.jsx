import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar.jsx';
import PostCell from './PostCell.jsx';
import Navbar from './Navbar.jsx';

function Search() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [resultList, setResultList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [width, setWidth] = useState(window.innerWidth);
    const breakpoint = 768;
    useEffect(() => {
        const handleResizeWindow = () => setWidth(window.innerWidth);
         // subscribe to window resize event "onComponentDidMount"
        window.addEventListener("resize", handleResizeWindow);
        return () => {
            // unsubscribe "onComponentDestroy"
            window.removeEventListener("resize", handleResizeWindow);
        };
    }, []);
    axios.defaults.withCredentials = true;
    useEffect(() => {
        const fetchAuthStatus = async () => {
            try{
                const res = await axios.get(process.env.REACT_APP_BACKEND_URL);
                console.log(res.data)
                if(res.data.valid){
                    setIsLoggedIn(true);
                    
                    setUsername(res.data.username);
                }else{
                    setIsLoggedIn(false);
                }
            }catch(e){
                console.log(e);
            }
        }
        fetchAuthStatus();
    }, []);
    const handleSearch = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post(process.env.REACT_APP_BACKEND_URL + "/search", {term : searchTerm}, {headers: {'Content-Type': 'application/json'}});
            setResultList(res.data);
        }catch(err){
            console.log(err);
        }
    };
    if(width>breakpoint){
        return (
            <div className='flex'>
                <Sidebar isLoggedIn={isLoggedIn} username={username}/>
                <div className='min-w-60'></div>
                <div className='p-4 pt-0 w-full'>
                    <div className='w-full fixed bg-white z-10'>
                    <h1 className='w-full bg-white mt-4 font-inter text-onyx text-3xl'>Ara</h1>
                    </div>
                    <div className='flex w-full mt-20 gap-x-3'>
                        <input className='w-full min-h-12 rounded-md p-1 h-2 font-inter border-2' placeholder='Arama Terimi Girin.' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <button onClick={handleSearch}>
                            <img src='/assets/Search.png' alt='Search Icon'></img>
                        </button>
                    </div>
                    <div className='mt-2 divide-y-2'>
                    {resultList ? resultList.map((post) => (
                        <PostCell key={post.idEntry} idEntry={post.idEntry} title= {post.Title} username= {post.username} content= {post.Content} date= {post.date} userid={post.userId}   />
                    )) : <p>Bir hata oluştu.</p>}
                </div>
                </div>
                <div className='min-w-60'></div>
            </div>
          )
    }
    return(
        <div>
            <Navbar isLoggedIn={isLoggedIn}/>
            <div className='p-4 pt-0 w-full'>
                    <div className='w-full fixed mt-16 bg-white z-10'>
                    <h1 className='w-full bg-white mt-4 font-inter text-onyx text-3xl'>Ara</h1>
                    </div>
                    <div className='flex w-full pt-36 gap-x-3'>
                        <input className='w-full min-h-12 min-w-fit rounded-md p-1 h-2 font-inter border-2' placeholder='Arama Terimi Girin.' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <button onClick={handleSearch}>
                            <img src='/assets/Search.png' alt='Search Icon'></img>
                        </button>
                    </div>
                    <div className='mt-2 divide-y-2'>
                    {resultList ? resultList.map((post) => (
                        <PostCell key={post.idEntry} idEntry={post.idEntry} title= {post.Title} username= {post.username} content= {post.Content} date= {post.date} userid={post.userId}   />
                    )) : <p>Bir hata oluştu.</p>}
                    </div>
            </div>
        </div>
        
    )
  
}

export default Search