import FollowModal from "./FollowModal";

export default function FollowOverlay({title,username,handleOverlayClose}){
    return(
        <div className='post-overlay'>
            <FollowModal title={title}  username={username} />
            <button className="close-button" onClick={handleOverlayClose}>
                &times;
            </button>
        </div>
    )
}