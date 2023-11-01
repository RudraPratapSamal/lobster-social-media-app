import React from 'react'
import {BrowserRouter as Router, Routes, Route,useNavigate} from "react-router-dom";
import {useCookies} from 'react-cookie'
import { useState,useEffect } from 'react';
import axios from './api/axios';
import './App.css';
import NavigationBar from './components/NavigationBar'
import CreateAccountBox from './components/CreateAccountBox'
import Login from './components/Login';
import ForgotBox from './components/ForgotBox'
import Feed from './components/Feed';
import Claws from './components/Claws';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import Settings from './components/Settings';
import SettingDetails from './components/SettingDetails';
import SettingsDeleteAccount from './components/SettingsDeleteAccount';
import Thanks from './components/Thanks';
import NotFound from './components/NotFound';
import CreatePost from './components/CreatePost';
import SearchList from './components/SearchList';


function App() {
    const navigate = useNavigate()
    const [cookies, removeCookie] = useCookies([]);
    const [nav,setNav] = useState(false)
    useEffect(()=>{
        const verifyCookie = async ()=>{
            if(!cookies.token){
                navigate('/login')
            }
            const {data} = await axios.post("/",{},{withCredentials:true})
            const {status} = data
            return status ? setNav(true) : (setNav(false),removeCookie("token"));
        }
        verifyCookie()
    },[cookies,navigate,removeCookie])
  return (
    <>
      {nav && <NavigationBar/>}
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/forgot-password' element={<ForgotBox/>} />
        <Route path='/create-new-account' element={<CreateAccountBox/>} />
        <Route path='/' element={<Feed/>} />
        <Route path='/search-user' element={<SearchList/>} />
        <Route path='/:username' element={<Profile/>} />
        <Route path='/:username/not-found' element={<NotFound/>} />
        <Route path='/claws' element={<Claws/>} />
        <Route path='/notifications' element={<Notifications/>} />
        <Route path='/create-your-post' element={<CreatePost/>} />
        <Route path='/account-settings' element={<Settings/>}>
          <Route path='/account-settings/edit-account-details' element={<SettingDetails/>} />
          <Route path='/account-settings/delete-account' element={<SettingsDeleteAccount/>} />
        </Route>
        <Route path='/deleted-account' element={<Thanks/>} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
    </>
  );
}

export default App;