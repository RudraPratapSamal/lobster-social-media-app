import PostOverlay from "./PostOverlay"
import {useEffect, useState} from 'react'
import axios from "axios"
export default function ProfilePost({username,profilePic,profileUsername,media,caption,dateTime,id}){
    const [overlayVisible,setOverlayVisible]= useState(false)
    const [likesCount,setLikesCount]=useState(0)
    function handleOverlayOpen(){
        setOverlayVisible(true);
    };
    function handleOverlayClose(){
        setOverlayVisible(false);
    };

    useEffect(()=>{
        async function getLikeCount() {
            try {
              const like = await axios.post('/api/get-post-likes-count', { id});
              console.log(like)
              setLikesCount(like.data.likesCount);
            } catch (error) {
              console.log('likes count', error.message);
            }
          }
          getLikeCount();
    },[])

    return(
        <>
            <div className="profile-post" onClick={handleOverlayOpen}>
                <img src={media}/>
                <div>
                    {likesCount} likes
                </div>
            </div>
            {overlayVisible && <PostOverlay id={id} username={username} profilePic={profilePic} handleOverlayClose={handleOverlayClose} profileUsername={profileUsername} media={media} caption={caption} dateTime={dateTime}/>}
        </>
    )
}