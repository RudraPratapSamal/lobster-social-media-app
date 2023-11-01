import React,{useEffect, useState} from 'react'
import {Link, Outlet, useNavigate } from 'react-router-dom';
import {useCookies} from 'react-cookie'
import axios from '../api/axios';
import PreLoader from './PreLoader';
import SettingDetails from './SettingDetails';
import SettingsNavigationBar from './SettingsNavigationBar';
import SettingsDeleteAccount from './SettingsDeleteAccount';

export default function Settings(){
    const [username,setUsername]=useState('')
    const [settingsData,setSettingsData]=useState({})

    const navigate = useNavigate()
    const [cookies, removeCookie] = useCookies([]);
    const [verificationProgress,setVerificationProgress] = useState(true)

    useEffect(()=>{
        const verifyCookie = async ()=>{
            if(!cookies.token){
                navigate('/login')
            }
            const {data} = await axios.post("/",{},{withCredentials:true})
            const {status,username} = data
            setUsername(username)
            setVerificationProgress(false)
            return !status && (removeCookie("token"), navigate("/login"));
        }
        verifyCookie()
    },[cookies,navigate,removeCookie])

    return (
        <>
        {verificationProgress?(
            <PreLoader/>
        ):(
            <>
                <div className='main-feed'>
                    <SettingsNavigationBar username={username}/>
                    <div id='setting-box'>
                            <Outlet context={username}/>
                    </div>
              </div>
            </>
        )}
        </>
    )
}