import {React, useState, useEffect} from 'react'
import Sidebar from './Sidebar.jsx'
import axios from 'axios';
import NotificationHandler from './NotificationHandler.jsx';

function Notifications() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [notifications, setNotifications] = useState([]);
    axios.defaults.withCredentials = true;
    useEffect(() => {
        const fetchAuthStatus = async () => {
            try{
                const res = await axios.get(process.env.REACT_APP_BACKEND_URL);
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
      useEffect(() => {
        const fetchNotifications = async () => {
            try{
                const res = await axios.post(process.env.REACT_APP_BACKEND_URL + "/notifications", {userId: userId},{headers: {'Content-Type': 'application/json'}});
                setNotifications(res.data);
            }catch(e){
                console.log(e)
            }
        }
        fetchNotifications();
        // eslint-disable-next-line
      }, [isLoggedIn])
  return (
    <div className='flex'>
        <Sidebar isLoggedIn={isLoggedIn} username={username} />
        <div className='min-w-60'></div>
        <div className='p-4 pt-0 w-full'>
            <div className='w-full fixed bg-white z-10'>
            <h1 className='w-full bg-white mt-4 font-inter text-onyx text-3xl'>Bildirimler</h1>
            </div>
            <div className='w-full mt-20 p-2'>
                {isLoggedIn ? 
                <NotificationHandler notifications = {notifications}/>
                : <p className='text-inter text-md'>Bildirimlerinizi görebilmek için giriş yapın.</p>}
            </div>
        </div>
        <div className='min-w-60'></div>
    </div>
  )
}

export default Notifications