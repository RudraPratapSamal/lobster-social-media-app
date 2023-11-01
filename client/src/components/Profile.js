import ProfileHead from "./ProfileHead";
import ProfilePosts from "./ProfilePosts";
import React,{useEffect, useState} from 'react'
import {useNavigate,useParams } from 'react-router-dom';
import {useCookies} from 'react-cookie'
import axios from '../api/axios';
import PreLoader from './PreLoader';

export default function Profile(){
    const profileUsername=useParams()
    const [username,setUsername]=useState('')
    const [posts,setPosts]=useState(0)
    const [followers,setFollowers] = useState(0)
    const [following,setFollowing] = useState(0)
    const [fullname,setFullname]=useState('')
    const [bio,setBio]=useState('')
    const [profilePic,setProfilePic]=useState('')
    const [userData,setUserData]=useState({})

    const navigate = useNavigate()
    const [cookies, removeCookie] = useCookies([]);
    const [verificationProgress,setVerificationProgress] = useState(true)

    useEffect(()=>{
        const getFollowCount=async()=>{
            const followCount = await axios.post('/api/get-follow-count',{username:profileUsername.username})
            setFollowers(followCount.data.followers)
            setFollowing(followCount.data.following)
            setPosts(followCount.data.posts)
        }
        const verifyCookie = async ()=>{
            if(!cookies.token){
                navigate('/login')
            }
            const {data} = await axios.post("/",{},{withCredentials:true})
            const {status,username} = data
            setUsername(username)
            try{
                const userDetails = await axios.post('/api/fetch-user-details',{username:profileUsername.username})
                if(userDetails.status===200){
                    setFullname(userDetails.data.fname)
                    setBio(userDetails.data.bio)
                    setProfilePic(userDetails.data.ppic)
                }
                else{
                    console.log('user not found')
                }
            }catch(error){
                console.log(error.message)
                navigate(`/${profileUsername.username}/not-found`)
            }
            setVerificationProgress(false)
            // return !status && (removeCookie("token"), navigate("/login"));
        }
        verifyCookie()
        getFollowCount()
    },[cookies,navigate,removeCookie])

    useEffect(() => {
        setUserData({
          fullname: fullname,
          bio: bio,
          ppic: profilePic,
          profileUsername: profileUsername.username,
          posts: posts,
          followers: followers,
          following: following,
          username:username
        });
      }, [fullname, bio, profilePic, profileUsername, posts, followers, following, username]);

    const Logout = ()=>{
        removeCookie('token')
        navigate('/login')
    }
    return (
        <>
        {verificationProgress?(
            <PreLoader/>
        ):(
            <>
                <div className='main-feed'>
                    <div className="profile-feed">
                        <ProfileHead data={userData}/>
                        <ProfilePosts username={username} profileUsername={profileUsername.username} profilePic={profilePic}/>
                    </div>
                </div>
            </>
        )}
        </>
    )
}