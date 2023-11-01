import React,{useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import axios from '../api/axios'
import FollowOverlay from './FollowOverlay'

export default function ProfileDetail(props){
    const data = {
        ru:props.username,
        fu:props.profileUsername
    }

    const [followStatus,setFollowStatus]=useState(false)
    const [followTitle,setFollowTitle]=useState('')
    const [requestStatus,setRequestStatus]=useState(false)
    const [followValue,setFollowValue]=useState('')
    const [cssID,setCssID]=useState('blue-btn')

    const [overlayVisible,setOverlayVisible]=useState(false)
    const [title,setTitle]=useState('')
    function toggleOverlay(){
        setOverlayVisible(!overlayVisible);
    }
    function handleOverlayOpen(title){
        setTitle(title)
        setOverlayVisible(true);
    };

    function handleOverlayClose(){
    setOverlayVisible(false);
    };
    useEffect(()=>{
        const getFollowStatus= async()=>{
            const cursor = await axios.post('/api/get-follow-status',{data})
            if(cursor.data.status=='n'){
                setRequestStatus(true)
                setFollowStatus(false)
                setFollowValue('Requested')
                setFollowTitle('Cancel Request')
                setCssID('grey-btn')
                
            }else if(cursor.data.status=='y'){
                setRequestStatus(true)
                setFollowStatus(true)
                setFollowValue('Following')
                setFollowTitle('Unfollow')
                setCssID('blue-btn')
            }else if(cursor.data.status==null){
                setRequestStatus(false)
                setFollowStatus(false)
                setFollowValue('Follow')
                setFollowTitle('Request to Follow')
                setCssID('blue-btn')
            }
        }
        getFollowStatus()
    },[])

    async function handleFollow(){
        try {
            axios.post('/api/follow-profile-process',{data})
            if(followStatus===false && requestStatus===false){
                setRequestStatus(true)
                setFollowValue('Requested')
                setFollowTitle('Cancel Request')
                setCssID('grey-btn')
            }
            else if(followStatus===false && requestStatus===true){
                setRequestStatus(false)
                setFollowValue('Follow')
                setFollowTitle('Request to Follow')
                setCssID('blue-btn')
            }else if(followStatus===true && requestStatus===true){
                setRequestStatus(false)
                setFollowValue('Follow')
                setFollowTitle('Request to Follow')
                setCssID('blue-btn')
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return(
        <>
            <div className="detail-top">
                <div className="fullname">{props.name}</div>
                <div className="username">@{props.profileUsername}
                    <Link to='/account-settings/edit-account-details'>
                        {props.profileUsername===props.username && <button>Edit Profile</button>}
                    </Link>
                </div>
            </div>
            <div className="detail-mid">
                {props.bio}
            </div>
            <div className="detail-bottom">
                <div className="profile-qnt">
                    <b>
                        {props.posts}
                    </b>
                    <br/>
                    {props.posts>1?'Posts':'Post'}
                </div>
                <div className="profile-qnt" onClick={()=>handleOverlayOpen('Followers')}>
                    <b>
                        {props.followers}
                    </b>
                    <br/>
                    {props.followers>1?'Followers':'Follower'}
                </div>
                <div className="profile-qnt" onClick={()=>handleOverlayOpen('Following')}>
                    <b>
                        {props.following}
                    </b>
                    <br/>
                    {props.following>1?'Followings':'Following'}
                </div>
            </div>
            <div className='details-btns'>
                {(props.profileUsername!==props.username && props.username!==undefined) && <button onClick={handleFollow} title={followTitle} id={cssID}>{followValue}</button>}
            </div>
            {overlayVisible && <FollowOverlay title={title} username={props.profileUsername} handleOverlayClose={handleOverlayClose}/>}
        </>
    )
}