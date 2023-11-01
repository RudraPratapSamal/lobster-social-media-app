import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineTrash } from 'react-icons/hi2';
import axios from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';

export default function Post({ username, profilePic, id, profileUsername, media, caption, dateTime }) {
  const nTime = Math.floor((Date.now() - Date.parse(dateTime)) / 1000);
  const [pic, setPic] = useState(profilePic);
  const deleteVisible = username === profileUsername;
  const [likesCount, setLikesCount] = useState(0);
  const [hearted, setHearted] = useState(null);

  useEffect(() => {
    async function getProfilePic() {
      try {
        const user = await axios.post('/api/fetch-user-details', { username: profileUsername });
        setPic(user.data.ppic);
      } catch (error) {
        console.log('profile pic', error.message);
      }
    }

    async function getLikeStatus() {
      try {
        const response = await axios.post('/api/get-post-like-status', { id: id, likeUsername: username });
        setHearted(response.data.length > 0);
      } catch (error) {
        console.log('like status', error.message);
      }
    }

    async function getLikesCount() {
      try {
        const likes = await axios.post('/api/get-post-likes-count', { id});
        setLikesCount(likes.data.likesCount);
      } catch (error) {
        console.log('likes count', error.message);
      }
    }

    if (profilePic === undefined) {
      getProfilePic();
    }
    if (hearted === null) {
      getLikeStatus();
      getLikesCount();
    }
  }, [id, username, profileUsername, profilePic, hearted]);

  async function handleDeletePost() {
    try {
      const deleted = await axios.post('/api/delete-profile-post', { id });
      if (deleted.data.deleted === true) {
        toast.success('Memory deleted successfully!', {
          position: 'top-center',
          hideProgressBar: true,
        });
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      }
    } catch (error) {
      toast.error('Error Occurred', {
        position: 'top-center',
        hideProgressBar: true,
      });
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
      console.log('delete post', error.message);
    }
  }

  async function handleHeart() {
    const newHearted = !hearted;
    try {
      const response = await axios.post('/api/update-post-likes', { id, username, hearted });
      setHearted(newHearted);
      setLikesCount(newHearted ? likesCount + 1 : likesCount - 1);
    } catch (error) {
      console.log('update like status', error.message);
    }
  }

  return (
    <>
      <div className="post">
        <div className="post-head">
          <div className="post-head-left">
            <Link to={`/${profileUsername}`} className="post-links">
              <img src={profilePic !== undefined ? profilePic : pic} alt="Profile" />
            </Link>
            <Link to={`/${profileUsername}`} className="post-links">
              <div className="post-username">{profileUsername}</div>
            </Link>
          </div>
          <div className="post-head-right">
            <div className="delete-btn">{deleteVisible && <span onClick={handleDeletePost}><HiOutlineTrash /></span>}</div>
          </div>
        </div>
        <div className="post-media">
          <img src={media} alt="Post Media" />
        </div>
        <div className="post-details">
          <div className="like-count">
            <img src={hearted ? 'red-heart.png' : 'heart.png'} onClick={handleHeart} alt="Heart" />
            {likesCount > 0 ? (likesCount > 1 ? `${likesCount} likes` : `${likesCount} like`) : ''}
          </div>
          <div className="post-body">{caption}</div>
          <div className="post-foot">
            {nTime < 60 ? `${nTime} seconds ago` : nTime / 60 < 60 ? `${Math.floor(nTime / 60)} minutes ago` : nTime / (60 * 60) < 24 ? `${Math.floor(nTime / (60 * 60))} hours ago` : nTime / (60 * 60 * 24) < 2 ? 'Yesterday' : `${Math.floor(nTime / (60 * 60 * 24))} days ago`}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
