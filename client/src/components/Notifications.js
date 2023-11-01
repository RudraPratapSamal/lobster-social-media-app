import React, { useState,useEffect } from 'react';
import {useCookies} from 'react-cookie'
import { useNavigate } from "react-router-dom";
import Notification from './Notification';
import axios from '../api/axios';
import PreLoader from './PreLoader';

export default function Notifications(){
    const [username,setUsername]=useState('')
    const [notifications,setNotifications]=useState([])

    const navigate = useNavigate()
    const [cookies, removeCookie] = useCookies([]);
    const [verificationProgress,setVerificationProgress] = useState(true)
    useEffect(()=>{
      const verifyCookie = async ()=>{
        if(!cookies.token){
            setVerificationProgress(false)
            return
        }
        const {data} = await axios.post("/",{},{withCredentials:true})
        const {status,username} = data
        setUsername(username)
        try {
            const notificationData = await axios.post('/api/get-follow-notifications',{username:username})
            setNotifications(notificationData.data)
        } catch (error) {
            console.log('notification useEffect',error)
        }
        setVerificationProgress(false)
        return !status && (removeCookie("token"), navigate("/login"))
      }
      verifyCookie()
    },[cookies,navigate,removeCookie])

    return(
        <>
            {verificationProgress?(
                <PreLoader/>
            ):(
                <div className="main-feed">
                    <div className="notification-box">
                        <h2>Notifications</h2>
                        <div className="notification-drawer">
                            {notifications.length>0?
                                <ul>
                                    {notifications.map((notification,index)=>(
                                        (username!==notification.requested_user &&
                                            <li key={index}>
                                                <Notification username={username} status={notification.request_status} rUsername={notification.requested_user} time={notification.dateTime} />
                                            </li>    
                                        )
                                    ))}
                                </ul>
                            :"No Notifications"}
                        </div>
                    </div>
                </div> 
            )
            }
        </>    
    )
}