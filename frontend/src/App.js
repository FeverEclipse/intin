import {React} from 'react';
import Login from './Pages/Login.jsx';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from './Pages/Home.jsx';
import Search from './Pages/Search.jsx';
import axios from 'axios';
import Post from './Pages/Post.jsx';
import Register from './Pages/Register.jsx';
import Notifications from './Pages/Notifications.jsx';
import Profile from './Pages/Profile.jsx';
import ProfileLikes from './Pages/ProfileLikes.jsx';
import About from './Pages/About.jsx';

const pageIds = [];

function fetchAllPosts(){
      axios.get(process.env.REACT_APP_BACKEND_URL + "/posts").then(res => {
        res.data.forEach(data => {
          pageIds.push(data.idEntry);
        });
      }).catch(err => {
        console.log(err);
      });
  
}

fetchAllPosts();

function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
      {pageIds.map(pageId => (<Link key={pageId} to={"posts/" + pageId}/>))}
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/search' element={<Search/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/profile/likes' element={<ProfileLikes/>}/>
          <Route path='/notifications' element={<Notifications/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/posts/:pageId' element={<Post/>}/> 
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;
