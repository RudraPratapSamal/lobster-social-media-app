import { useEffect, useState } from "react"
import axios from "../api/axios"

export default function ModalUser({username}){
    const [profilePic,setProfilePic]=useState('')
    const [fullname,setFullname]=useState('')
    useEffect(()=>{
        async function getUserDetails(){
            try {
                const userData = await axios.post('/api/get-all-usernames',{term:username})
                setFullname(userData.data[0].fullname)
                setProfilePic(userData.data[0].profilepic)
            } catch (error) {
                console.log('follower following user details',error.message)
            }
        }
        getUserDetails()
    })
    return(
        <>
            <div className="modal-user">
                <div className='modal-user-pic'>
                    <img src={profilePic!==null && profilePic!==''?profilePic:'avatar.png'}/>
                </div>
                <div className='modal-user-body'>
                    <div className='modal-fullname'>{fullname}</div>
                    <div className='modal-username'>{username}</div>
                </div>
            </div>
        </>
        
    )
}