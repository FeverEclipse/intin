import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const navigate = useNavigate();
	const goBack = () => {
		navigate("/");
	}
    axios.defaults.withCredentials = true;
    const handleEvent = async (e) => {
        e.preventDefault();
        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/login', {user: user, pwd: pwd}, {headers: {'Content-Type': 'application/json'}});
        if(response.data.isSuccess){
            navigate("/");
        }else{
            console.log("Fail");
        }
    }
    return (        
        <div className="login fixed my-auto inset-x-0 inset-y-0 pt-8 p-24">
            <Link to={"/"}>
            <img
            src="/assets/logo.png"
            className={`w-36 mb-16 mx-auto cursor-pointer duration-500`}
            alt="Menu Item"
          />
            </Link>
            <div className='flex w-96 mx-auto mb-4 gap-x-3'>
                <button onClick={goBack} className='ms-1 hover:opacity-60'><img className='w-7 h-7' src={`/assets/Back-white.png`} alt="Back Icon"/></button>
                <h1 className='w-fit  text-3xl mb-0.5 font-semibold font-inter text-white'>Giriş Yap</h1>
                <div className="w-0.5 bg-white rounded-full"></div>
                <Link to={'/register'}>
                <button className="w-fit text-3xl mb-0.5 font-semibold font-inter text-white opacity-50 hover:opacity-90">Üye Ol</button>
                </Link>
            </div>
            <div className="h-fit w-96 m-auto inset-x-0 inset-y-0 p-4 bg-white opacity-90 rounded-xl border-1">
                <form onSubmit={handleEvent} className='mb-2 relative ms-0 bottom-0'>
                    <label className='w-full text-onyx py-1 mt-1'>
                        <input className='w-full min-h-12 border-1 rounded-md p-2 font-inter' autoComplete='email' placeholder='E-Posta Adresi' type="email" value={user} onChange={e => setUser(e.target.value)} />
                    </label>
                    <label className='w-full text-onyx py-1  mt-1'>
                        <input className='w-full min-h-12 border-1 rounded-md p-2 font-inter' autoComplete='current-password' placeholder='Şifre' type="password" value={pwd} onChange={e => setPwd(e.target.value)} />
                    </label>
                    <button className='w-full mt-2 h-12 rounded-md bg-onyx opacity-70 hover:opacity-100 text-white font-inter duration-200' type="submit">Giriş Yap</button>
                </form>
            </div>
        </div>
    )
}

export default Login