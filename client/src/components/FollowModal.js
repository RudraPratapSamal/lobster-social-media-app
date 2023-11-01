import { useEffect, useState } from "react";
import ModalUser from "./ModalUser";
import axios from '../api/axios'

export default function FollowModal({title,username}){
    const [users,setUsers]=useState([])
    useEffect(()=>{
        async function getFollowUsers(){
            try {
                const users = await axios.post('/api/get-follow-users',{username,title})
                console.log(users.data)
                setUsers(users.data)
            } catch (error) {
                console.log('followers and following modal',error.message)
            }
        }
        getFollowUsers()
    },[])
    
    return(
        <div className="follow-modal">
            <div className="modal-title">
                {title}
            </div>
            <div className="modal-body">
                {users.map((user) => (
                        <ModalUser username={title==='Followers'?(user.requested_user):(user.following_user)} key={user._id}/>
                ))}
                
            </div>
        </div>
    )
}