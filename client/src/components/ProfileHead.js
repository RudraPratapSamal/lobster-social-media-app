import React,{useEffect, useState} from 'react'
import ProfileDetail from "./ProfileDetail";

export default function ProfileHead(props){
    return(
        <>
            <div className="profile-head">
                <div className="left">
                    <img src={(props.data.ppic===null || props.data.ppic==='')?'avatar.png':props.data.ppic}/>
                </div>
                <div className="right">
                    <ProfileDetail profileUsername={props.data.profileUsername} bio={props.data.bio} name={props.data.fullname} posts={props.data.posts} followers={props.data.followers} following={props.data.following} username={props.data.username}/>
                </div>
            </div>
        </>
    )
}