/* eslint-disable no-restricted-globals */

import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const Sidebar = (props) => {
  const Menus = [
    { title: "Ana Sayfa", src: "Home" , dir: "/"},
    { title: "Ara", src: "Search" , dir: "/search"},
    { title: "Bildirimler", src: "Bell", dir: "/notifications" },
  ];
  const navigate = useNavigate();
  const isLoggedIn = props.isLoggedIn;
  
  return (
      <div className={`fixed min-w-60 bg-onyx h-full p-5 pt-8 shadow-[rgba(0,0,15,0.5)_5px_1px_10px_0px] duration-300`}>
          <img
            src="/assets/logo.png"
            className={`w-36 cursor-pointer duration-500`}
            alt="Menu Item"
          />
        <ul className="pt-4 ps-0">
          {Menus.map((Menu, index) => (
            <a href={Menu.dir}
              key={index}
              className={`flex no-underline font-inter rounded-md p-2 cursor-pointer hover:text-degisikgri text-white text-sm gap-x-2 mt-1 
              ${
                index === 0 && "text-degisikgri"
              } `}
            >
              <img src={`/assets/${Menu.src}.png`} alt="Menu Item"/>
              <span className={`origin-left duration-200 mt-0.5`}>
                {Menu.title}
              </span>
            </a>
          ))}
        </ul>
        <div className="h-1/4"></div>
        <div className="h-screen mb-0 mt-3/4">
          {isLoggedIn ? <Link className=" no-underline" to={"/profile"}>
          <button type="button" className="flex no-underline font-inter rounded-md p-2 text-white text-sm gap-x-2 mt-52">
            <img className="" src={`/assets/Account.png`} alt="Menu Item" />
            <span className={`origin-left duration-200 mt-0.5`}>
                Profil
            </span>
          </button>
          </Link> : <Link className=" no-underline" to={"/login"}>
          <button type="button" className="flex no-underline font-inter rounded-md p-2 cursor-pointer hover:text-degisikgri text-white text-sm gap-x-2 mt-52">
            <img src={`/assets/Account.png`} alt="Menu Item" />
            <span className={`origin-left duration-200 mt-0.5`}>
                Giriş Yap
            </span>
          </button>
            </Link>}
            <Link className="no-underline" to={"/about"}>
          <button type="button" className="flex no-underline font-inter rounded-md p-2 cursor-pointer hover:text-degisikgri text-white text-sm gap-x-2 mt-2">
            <img src={`/assets/Info.png`} alt="Menu Item" />
            <span className={`origin-left duration-200 mt-0.5`}>
                Hakkında
            </span>
          </button>
            </Link>
          </div>
      </div>
      
      
    
  );
};
export default Sidebar;