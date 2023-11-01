import React,{useEffect, useState} from 'react'
import Post from './Post';
import {useNavigate } from 'react-router-dom';
import {useCookies} from 'react-cookie'
import axios from '../api/axios';
import PreLoader from './PreLoader';

export default function Feed(){
    const navigate = useNavigate()
    const [cookies, removeCookie] = useCookies([]);
    const [verificationProgress,setVerificationProgress] = useState(true)
    const [username,setUsername]=useState('')
    const [allUsers,setAllUsers]=useState([])
    const [posts,setPosts]=useState([])
    useEffect(()=>{
        const verifyCookie = async ()=>{
            if(!cookies.token){
                navigate('/login')
            }
            const {data} = await axios.post("/",{},{withCredentials:true})
            const {status,username} = data
            setUsername(username)
            try {
                const title='Following'
                const users = await axios.post('/api/get-follow-users',{username,title})
                setAllUsers(users.data)
            } catch (error) {
                console.log('feed posts',error.message)
            }
            setVerificationProgress(false)
            return !status && (removeCookie("token"), navigate("/login"));
        }
        verifyCookie()
    },[cookies,navigate,removeCookie])

    useEffect(()=>{
        async function getAllPosts(){
            const response = await axios.post('/api/get-feed-posts',{allUsers})
            setPosts(response.data)
        }
        getAllPosts()
    },[allUsers])
    return(
        <>
        {verificationProgress?(
            <PreLoader/>
        ):(
            <div className='main-feed'>
                <div className='feed'>
                    {posts.map((post) => (
                        <Post key={post._id} id={post._id} username={username} profileUsername={post.username} media={post.post_media} caption={post.post_caption} dateTime={post.dateTime}/>
                    ))}
                </div>
            </div>
        )}
        </>
    )
}