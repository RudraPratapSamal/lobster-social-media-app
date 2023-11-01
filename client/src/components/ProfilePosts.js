import ProfilePost from "./ProfilePost";
import axios from '../api/axios'
import {useEffect, useState } from "react"

export default function ProfilePosts({username,profileUsername,profilePic}){
    const [posts, setPosts] = useState([]);
    useEffect(()=>{
        async function getAllPosts(){
            const response = await axios.post('/api/get-profile-posts',{username:profileUsername}) 
            setPosts(response.data)
        }
        getAllPosts()
    },[profileUsername])
    return(
        <div className="profile-posts">
            {/* {posts[0].post_media} */}
            {
                posts.map((post)=>(
                    <ProfilePost username={username} profilePic={profilePic} id={post._id} profileUsername={profileUsername} media={post.post_media} caption={post.post_caption} dateTime={post.dateTime} likes={post.likes}/>
                ))
            }
        </div>
    )
}