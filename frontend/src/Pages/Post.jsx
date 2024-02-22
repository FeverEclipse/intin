import React, {useEffect} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import NotFound from './NotFound.jsx';
import axios from 'axios';
import Sidebar from './Sidebar.jsx';
import { useState } from 'react';
import Reply from './Reply.jsx';

var pageId = '';

function Replies(props){
    var idEntry = props.idEntry;
    const [replies, setReplies] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          let response = await axios.get(process.env.REACT_APP_BACKEND_URL + "/replies/" + idEntry).catch(err => console.log("not found"));
          setReplies(response.data);
        };
        fetchData();
        // eslint-disable-next-line
      }, []);
      if(replies){
        return(
            replies.map((reply) => (
                <Reply key={reply.idReply} reply = {reply} />
            )))
      }else{
        return(
            <NotFound/>
        )
      }
}

function Post() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [liked, setLiked] = useState(false);
    const [reply, setReply] = useState('');
    const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	}
    pageId = useParams().pageId;
    const [curPage, setCurPage] = useState([]);
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
        const fetchData = async () => {
          let response = await axios.get(process.env.REACT_APP_BACKEND_URL + "/posts/" + pageId).catch(err => console.log("not found"));
          setCurPage(response.data);
        };
        fetchData();
        fetchAuthStatus();
      }, []);

      useEffect(() => {
        const fetchIsLiked = async () => {
            try{
                const res = await axios.post(process.env.REACT_APP_BACKEND_URL + "/isPostLiked", {postId: pageId, user_id: userId}, {headers: {'Content-Type': 'application/json'}});
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
      }, [userId]);
      
      const handleReply = async (e) => {
        e.preventDefault();
        if(isLoggedIn){
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/reply', {Content: reply, userId: userId, entryId: pageId}, {headers: {'Content-Type': 'application/json'}});
            if(response.data.Success){
                window.location.reload();
            }else{
                console.log(response.data.Message);
            }
            const response1 = await axios.post(process.env.REACT_APP_BACKEND_URL + '/notify', {userId: userId, sourceId: curPage[0].userId, type: 3,postId: curPage[0].idEntry, replyId: 0},{headers: {'Content-Type': 'application/json'}});
                if(response1.data.Success){
                    console.log("Bildirim gönderildi!")
                }else{
                    console.log(response1.data.Message)
                }
        }
        else{
            navigate("/login");
        }
    }

    const handlePostLike = async (e) => {
        e.preventDefault();
        if(isLoggedIn){
            if(!liked){
                const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/likepost', {postId: curPage[0].idEntry, user_id: userId},{headers: {'Content-Type': 'application/json'}});
                if(response.data.Success){
                    setLiked(true);
                    curPage[0].Likes += 1;
                }else{
                console.log(response.data.Message);
                }
                const response1 = await axios.post(process.env.REACT_APP_BACKEND_URL + '/notify', {userId: userId, sourceId: curPage[0].userId, type: 1,postId: curPage[0].idEntry, replyId: 0},{headers: {'Content-Type': 'application/json'}});
                if(response1.data.Success){
                    console.log("Bildirim gönderildi!")
                }else{
                    console.log(response1.data.Message)
                }
            }else{
                const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/unlikepost', {postId: curPage[0].idEntry, user_id: userId},{headers: {'Content-Type': 'application/json'}});
                if(response.data.Success){
                    setLiked(false);
                    curPage[0].Likes -= 1;
                }else{
                    console.log(response.data.Message);
                }
            }
            
        }else{
            navigate("/login");
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/delete', {id: curPage[0].idEntry}, {headers: {'Content-Type': 'application/json'}});
        if (response.data.Success){
            navigate("/");
        }else{
            console.log(response.data.Message);
        }
    }
    
    if(curPage[0]){
        let jsDate = new Date(curPage[0].date);

      // Date nesnesinin metotlarını kullanarak istediğiniz formatta bir karakter dizisi oluşturun
      let formattedDate = jsDate.getDate () + "." + (jsDate.getMonth () + 1) + "." + jsDate.getFullYear () + " " + jsDate.getHours () + ":" + jsDate.getMinutes ();
        if(curPage[0].idEntry === (Number(pageId))){
            return (
                <div className='flex w-full'>
                    <Sidebar isLoggedIn={isLoggedIn} username={username} />
                    <div className='min-w-60'></div>
                    <div className='p-4 pt-0 w-full'>
                        <div className='bg-white flex w-full gap-x-2 fixed z-10'>
                            <button onClick={goBack} className='mt-4 mb-2 hover:opacity-60 min-w-fit'><img className='w-8 h-8' src={`/assets/Back.png`} alt="Back Icon"/></button>
                            <h1 className='font-inter text-onyx text-3xl mt-4 min-w-fit'>Soru</h1>
                            
                        </div>
                        <div className='mt-20'>
                            <div className='flex'>
                            <h1 className='text-4xl min-w-fit'>{curPage[0].Title}</h1>
                            <div className='w-full'></div>
                            {isLoggedIn && curPage[0].username===username ? <button onClick={handleDelete} className='min-w-fit h-10 p-2 rounded-md hover:bg-gray-200 duration-200'><img className='w-6 h-6' alt='Delete Icon' src='/assets/Delete.png'></img></button> : <p></p>}
                            </div>
                        
                        <p>{curPage[0].Content}</p>
                        <div className='flex gap-x-6 mt-3'>
                            {liked ? <button className='flex p-1 min-w-fit min-h-fit gap-x-2 rounded-md hover:bg-gray-200 duration-200' onClick={handlePostLike}>
                                <img className='w-6 h-6' alt='Like Icon' src='/assets/Like.png'></img>
                                <p>{curPage[0].Likes}</p>
                            </button> : <button className='flex p-1 min-w-fit min-h-fit gap-x-2 rounded-md hover:bg-gray-200 duration-200' onClick={handlePostLike}>
                                <img className='w-6 h-6' alt='Like Icon' src='/assets/Like_light.png'></img>
                                <p>{curPage[0].Likes}</p>
                            </button>}
                            <p className='min-w-fit pt-1'>{formattedDate}</p>
                            <div className='w-full'></div>
                            <p className='min-w-fit'>{curPage[0].username} tarafından soruldu.</p>
                        </div>
                        <hr></hr>
                        <p className='text-2xl'>Cevaplar</p>
                        <div className='w-full mt-1 mb-3 p-2 border-1 rounded-md'>
                            <input className='w-full min-h-12 p-1 h-2 font-inter' placeholder='Yanıtını Yaz.' value={reply} onChange={e => setReply(e.target.value)} />
                            <button className='w-32 mt-2 h-12 rounded-md bg-onyx opacity-70 hover:opacity-100 text-white font-inter duration-200' onClick={handleReply}>Yayınla</button>
                        </div>
                        <Replies idEntry= {pageId} userId = {userId} isLoggedIn= {isLoggedIn}/>
                        </div>
                    </div>
                    
                </div>
              )
        }else{
            console.log(curPage)
            return(
                <NotFound/>
            )
        }
    }else{
        return <div>Loading...</div>;
    }
    
  
}

export default Post