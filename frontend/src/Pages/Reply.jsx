import {React, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Reply(props) {
    const [liked, setLiked] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    useEffect(() => {
        const fetchAuthStatus = async () => {
            try{
                const res = await axios.get(process.env.REACT_APP_BACKEND_URL);
                if(res.data.valid){
                    setIsLoggedIn(true);
                    setUserId(res.data.userId);
                }else{
                    setIsLoggedIn(false);
                }
            }catch(e){
                console.log(e);
            }
        }
        fetchAuthStatus();
    })
    useEffect(() => {
        const fetchIsLiked = async () => {
            try{
                const res = await axios.post(process.env.REACT_APP_BACKEND_URL + "/isReplyLiked", {replyId: props.reply.idReply, userId: userId}, {headers: {'Content-Type': 'application/json'}});
                if(res.data[0].isLiked){
                    if(res.data[0].isLiked > 0){
                        setLiked(true);
                    }else{
                        setLiked(false);
                    }
                }
            }catch(e){
                console.log(e);
            }
        }
        fetchIsLiked();
        // eslint-disable-next-line
      }, [userId]);
      const handleReplyLike = async (e) => {
        e.preventDefault();
        if(isLoggedIn){
            if(!liked){
                const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/likereply', {replyId: props.reply.idReply, userId:userId},{headers: {'Content-Type': 'application/json'}});
                if(response.data.Success){
                    setLiked(true);
                    props.reply.Likes += 1;
                }else{
                console.log(response.data.Message);
                }
                const response1 = await axios.post(process.env.REACT_APP_BACKEND_URL + '/notify', {userId: userId, sourceId: props.reply.userId, type: 2,postId: props.reply.idEntry, replyId: props.reply.idReply},{headers: {'Content-Type': 'application/json'}});
                if(response1.data.Success){
                    console.log("Bildirim gönderildi!")
                }else{
                    console.log(response1.data.Message)
                }
            }else{
                const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/unlikereply', {replyId: props.reply.idReply, userId: userId},{headers: {'Content-Type': 'application/json'}});
                if(response.data.Success){
                    setLiked(false);
                    props.reply.Likes -= 1;
                }else{
                    console.log(response.data.Message);
                }
            }
            
        }else{
            navigate("/login");
        }
    }
  return (
    <div>
                    <p className='text-l'>{props.reply.Content}</p>
                    <div className='flex gap-x-3'>
                        <p className='text-sm min-w-fit'>{new Date(props.reply.date).getDate() + "." + (new Date(props.reply.date).getMonth () + 1) + "." + new Date(props.reply.date).getFullYear () + " " + new Date(props.reply.date).getHours () + ":" + new Date(props.reply.date).getMinutes ()}</p>
                        {liked ? <button className='flex h-fit gap-x-1 pt-1 min-w-fit rounded-md hover:bg-gray-200 duration-200' onClick={handleReplyLike}>
                                <img alt='Like Icon' className='w-4 h-4 min-w-fit' src='/assets/Like.png'></img>
                                <p className='text-sm'>{props.reply.Likes}</p>
                        </button> : <button className='flex h-fit gap-x-1 pt-1 min-w-fit rounded-md hover:bg-gray-200 duration-200' onClick={handleReplyLike}>
                                <img alt='Like Icon' className='w-4 h-4 min-w-fit' src='/assets/Like_light.png'></img>
                                <p className='text-sm'>{props.reply.Likes}</p>
                        </button>}
                        <div className='w-full'></div>
                        <p className='text-sm min-w-fit'>{props.reply.username} tarafından yanıtlandı.</p>
                    </div>
                    <hr></hr>
                </div>
  )
}

export default Reply