import {React, useState, useEffect} from 'react'
import Sidebar from './Sidebar.jsx'
import axios from 'axios';

function About() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    useEffect(() => {
        const fetchAuthStatus = async () => {
            try{
                const res = await axios.get(process.env.REACT_APP_BACKEND_URL);
                console.log(res.data)
                if(res.data.valid){
                    setIsLoggedIn(true);
                    setUsername(res.data.username);
                    setUserId(res.data.userId);
                }else{
                    setIsLoggedIn(false);
                }
            }catch(e){
                console.log(e);
            }
        }
        fetchAuthStatus();
      }, []);
  return (
    <div className='flex'>
        <Sidebar isLoggedIn={isLoggedIn} username={username} />
        <div className='min-w-60'></div>
        <div className='p-4 pt-0 w-full'>
            <div className='w-full fixed bg-white z-10'>
            <h1 className='w-full bg-white mt-4 font-inter text-onyx text-3xl'>Hakkında</h1>
            </div>
            <p className='mt-24'>intin, insanların bilgi paylaşımını desteklemek amaçlı oluşturulan bir bireysel projedir.</p>
            <p className='font-inter'>Eyüp MENEVŞE - Hacettepe Üniversitesi Bilgisayar Mühendisliği Bölümü</p>
            <p>Bana ulaşmak için:</p>
            <a href='https://www.linkedin.com/in/menevseyup/'>LinkedIn</a>
            <p className='mt-2'>Yakında yol haritası paylaşacağım.</p>
            
        </div>
        <div className='min-w-60'></div>
    </div>
  )
}

export default About