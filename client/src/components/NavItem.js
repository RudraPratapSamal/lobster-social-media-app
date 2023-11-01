import React, { useState } from 'react'
import {Link, NavLink} from "react-router-dom"
import { HiOutlineChatBubbleLeftEllipsis,HiOutlineHome,HiOutlineBell,HiOutlineCog6Tooth } from "react-icons/hi2";

export default function NavItem(props){
    return(
        <div className='icons'>
            {props.icon}<span className='nav-link'>&nbsp; {props.title}</span>
        </div>
)
}