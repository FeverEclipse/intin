import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register(props) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        console.log(process.env.REACT_APP_BACKEND_URL + '/register');
        e.preventDefault();
        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/register', {username: username,email: email, password: password}, {headers: {'Content-Type': 'application/json'}});
        if(response.data.isRegistered){
            navigate("/login");
        }else{
            alert(response.data.Message);
        }
    }
    const navigate = useNavigate();
	const goBack = () => {
		navigate("/");
	}

    return (        
        <div className="login fixed m-auto inset-x-0 inset-y-0 pt-8 p-24">
            <Link to={"/"}>
            <img
            src="/assets/logo.png"
            className={`w-36 mb-16 mx-auto cursor-pointer duration-500`}
            alt="Menu Item"
          />
            </Link>
            
            <div className='flex w-96 mx-auto mb-4 gap-x-3'>
                <button onClick={goBack} className='ms-1 hover:opacity-60'><img className='w-7 h-7' src={`/assets/Back-white.png`} alt="Back Icon"/></button>
                <Link className='no-underline' to={'/login'}>
                <button className="w-fit text-3xl mb-0.5 font-semibold font-inter text-white opacity-50 hover:opacity-90">Giriş Yap</button>

                </Link>
                <div className="w-0.5 bg-white rounded-full"></div>
                <h1 className='w-fit  text-3xl mb-0.5 font-semibold font-inter text-white'>Üye Ol</h1>
            </div>
            <div className="h-fit w-96 m-auto inset-x-0 inset-y-0 p-4 bg-white opacity-90 rounded-xl border-1">
                <form onSubmit={handleRegister} className='mb-2 relative ms-0 bottom-0'>
                    <label className='w-full text-onyx py-1 mt-1'>
                        <input className='w-full min-h-12 border-1 rounded-md p-2 font-inter' autoComplete='username' placeholder='Kullanıcı Adı' type="username" value={username} onChange={e => setUsername(e.target.value)} />
                    </label>
                    <label className='w-full text-onyx py-1  mt-1'>
                        <input className='w-full min-h-12 border-1 rounded-md p-2 font-inter' autoComplete='email' placeholder='E-Posta Adresi' type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </label>
                    <label className='w-full text-onyx py-1  mt-1'>
                        <input className='w-full min-h-12 border-1 rounded-md p-2 font-inter' autoComplete='current-password' placeholder='Şifre' type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>
                    <button className='w-full mt-2 h-12 rounded-md bg-onyx opacity-70 hover:opacity-100 text-white font-inter duration-200' type="submit">Üye Ol</button>
                </form>
                <div className='flex w-full mt'>
                </div>

                
            </div>
        </div>
    )
}

export default Register