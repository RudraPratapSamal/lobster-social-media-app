import React,{useState,useEffect} from 'react'
import {Link, NavLink, useNavigate} from "react-router-dom"
import axios from '../api/axios'
import {useCookies} from 'react-cookie'
import { HiOutlineChatBubbleLeftEllipsis,HiOutlineHome,HiOutlineBell,HiOutlineCog6Tooth,HiOutlineUser,HiOutlineMagnifyingGlass,HiOutlinePlusSmall,HiOutlineArrowLeftOnRectangle } from "react-icons/hi2";
import NavItem from './NavItem';
import Logo from './Logo';
import SearchList from './SearchList';

export default function NavigationBar(){
    const navigate = useNavigate()
    const [cookies, removeCookie] = useCookies([]);
    const [username,setUserame] = useState('')
    const [fullname,setFullname] = useState('')
    useEffect(()=>{
        const verifyCookie = async ()=>{
            if(!cookies.token){
                navigate('/login')
            }
            const {data} = await axios.post("/",{},{withCredentials:true})
            const {status,username} = data
            setUserame(username)
            return !status && (removeCookie("token"), navigate("/login"));
        }
        verifyCookie()
    },[cookies,navigate,removeCookie])

    async function getAccountDetails(username){
        try {
            const data = {username:username}
            const response = await axios.post('/api/account-details',data,{
                headers:{
                    'Content-type': 'application/JSON',
                  }
            })
            if(response.status===200){
                setFullname(response.data.fullname)
            }
            else{
                console.log('no')
            }
        } catch (error) {
            console.log(error)
        }
    }
    getAccountDetails(username)
    const Logout = ()=>{
        removeCookie('token')
        navigate('/login')
    }
    return(
        <header>
            <nav>
                <div>
                    <div className='nav-head'>
                        <Link to={`/${username}`} className='nav-head-link'>
                            <Logo/>
                            {/* <center><img src='avatar.png'/>
                            <h5>{fullname}</h5></center> */}
                        </Link>
                    </div>
                    <ul>
                        <li>
                            <NavLink to='/' className='nav-links'>
                                <NavItem icon={<HiOutlineHome/>} title='Home'/>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`/search-user`} className='nav-links'>
                                <NavItem icon={<HiOutlineMagnifyingGlass />} title='Search'/>
                            </NavLink>
                            {/* <SearchList/> */}
                        </li>
                        <li>
                            <NavLink to='/claws' className='nav-links'>
                                <NavItem icon={<HiOutlineChatBubbleLeftEllipsis />} title='Claws'/>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to='/notifications' className='nav-links'>
                                <NavItem icon={<HiOutlineBell />} title='Notifications'/>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={`/${username}`} className='nav-links'>
                                <NavItem icon={<HiOutlineUser />} title='Profile'/>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <ul>
                    <li>
                        <NavLink to='/create-your-post' className='nav-links'>
                            <NavItem icon={<HiOutlinePlusSmall />} title='Create'/>
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to='/account-settings' className='nav-links'>
                            <NavItem icon={<HiOutlineCog6Tooth />} title='Settings'/>
                        </NavLink> 
                    </li>
                    <li>
                        <NavLink to='/login' onClick={Logout} className='nav-links'>
                            <NavItem icon={<HiOutlineArrowLeftOnRectangle />} title='Logout'/>
                        </NavLink> 
                    </li>
                </ul>
            </nav>
        </header>
    )
}