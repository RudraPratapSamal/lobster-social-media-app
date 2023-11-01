import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"
import axios from '../api/axios'
import { HiOutlineCheck,HiXMark } from "react-icons/hi2";

export default function Notification({username,status,rUsername,time}){
    const [fullname,setFullname]=useState('')
    const [profilePic,setProfilePic]=useState('')
    const [rStatus,setRStatus]=useState(status)
    const [btns,setBtns]=useState('')

    const nTime=Math.floor((Date.now()-Date.parse(time))/1000)

    async function getUserDetails(){
        try {
            const userData = await axios.post('/api/get-all-usernames',{term:rUsername})
            setFullname(userData.data[0].fullname)
            setProfilePic(userData.data[0].profilepic)
        } catch (error) {
            console.log('notification',error.message)
        }
    }
    getUserDetails()

    useEffect(()=>{
        if(rStatus==='n'){
            setBtns(
                <div className='notification-btns'>
                    <span id='check' onClick={acceptRequest}>
                        <HiOutlineCheck/>
                    </span>
                    <span id='cross' onClick={rejectRequest}>
                        <HiXMark/>
                    </span>
                </div>
            )
        }else{
            setBtns(null)
        }
    },rStatus)

    async function acceptRequest(){
        try {
            const updatedRequest = await axios.post('/api/update-follow-request',{
                ru:rUsername,
                fu:username,
                rStatus:'a'
            }) 
            setRStatus('y')
        } catch (error) {
            console.log('accept request',error.message)
        }
        
    }
    async function rejectRequest(){
        try {
            const updatedRequest = await axios.post('/api/update-follow-request',{
                ru:rUsername,
                fu:username,
                rStatus:'r'
            }) 
            setRStatus(null)
        } catch (error) {
            console.log('reject request',error.message)
        }
    }
    return(
        <div>
            <div className='notification'>
                <Link to={`/${rUsername}`} className='user-links'>
                    <div>
                        <div className='notification-user-pic'>
                            <img src={profilePic!==null && profilePic!==''?profilePic:'avatar.png'}/>
                        </div>
                        <div className='notification-body'>
                            <div className='notification-fullname'>{fullname}</div>
                            <div className='notification-msg'><b>{rUsername}</b>&nbsp;{rStatus!==null && (rStatus==='n'?'has requested to follow you':'is following you')}</div>
                        </div>
                    </div>
                </Link>
                <div>
                    {btns}
                </div>            
            </div>
            <div className='right'>
                {
                    nTime<60?nTime+' seconds ago':(
                        nTime/60<60?Math.floor(nTime/60)+' minutes ago':(
                            nTime/(60*60)<24?Math.floor(nTime/(60*60))+' hours ago':(
                                nTime/(60*60*24)<2?'Yesterday':Math.floor(nTime/(60*60*24))+' days ago'
                            )
                        )
                    )
                }
            </div>
        </div>
        
    )
}