import React from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Navbar(props) {
    const isLoggedIn = props.isLoggedIn;
  
    if(isLoggedIn){
      return (
        <div className='fixed flex w-screen bg-onyx h-16 md:hidden pt-1'>
          <Link className='min-w-fit' to={"/"}>
            <button>
              <img src="/assets/logo.png" className={`h-9 m-2.5 cursor-pointer duration-500`} alt="Menu Item"/>
            </button>
          </Link>
          <div className='w-full'></div>
          <Link className='min-w-fit' to={"/profile"}>
            <button type="button">
            <img className="h-7 mt-3.5 mx-2" src={`/assets/Account.png`} alt="Menu Item" />
            </button>
          </Link>
          <Link className='min-w-fit' to={"/notifications"}>
            <button type="button">
            <img className="h-7 mt-3.5 mx-2 " src={`/assets/Bell.png`} alt="Menu Item" />
            </button>
          </Link>
          <Link className='min-w-fit' to={"/search"}>
            <button type="button">
            <img className="h-7 mt-3.5 mx-2 me-4" src={`/assets/Search.png`} alt="Menu Item" />
            </button>
          </Link>
        </div>
      )
    }
    return(
      <div className='fixed flex w-screen bg-onyx h-16 md:hidden pt-1'>
          <Link className='min-w-fit' to={"/"}>
            <button>
              <img src="/assets/logo.png" className={`h-9 m-2.5 cursor-pointer duration-500`} alt="Menu Item"/>
            </button>
          </Link>
          <div className='w-full'></div>
          
          <Link className="min-w-fit mt-3.5 me-2 no-underline" to={"/login"}>
          <button type="button" className="flex font-inter rounded-md cursor-pointer text-white text-sm gap-x-1.5">
            <img className='h-7' src={`/assets/Account.png`} alt="Menu Item" />
            <span className={`origin-left duration-200 mt-1`}>
                Giriş Yap
            </span>
          </button>
            </Link>
            <Link className='min-w-fit' to={"/search"}>
            <button type="button">
            <img className="h-7 mt-3.5 mx-2 me-4" src={`/assets/Search.png`} alt="Menu Item" />
            </button>
          </Link>
        </div>
    )
  
}

export default Navbar