import Post from "./Post"
export default function PostOverlay({profilePic,handleOverlayClose,username,profileUsername,media,caption,dateTime,likes,id}){
    const deleteVisible = username===profileUsername
    return(
        <div className='post-overlay'>
            <Post profilePic={profilePic} id={id} username={username} profileUsername={profileUsername} media={media} caption={caption} dateTime={dateTime} likes={likes}/>
            <button className="close-button" onClick={handleOverlayClose}>
                &times;
            </button>
        </div>
    )
}