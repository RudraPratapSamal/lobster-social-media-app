import axios from '../api/axios';
import {useCookies} from 'react-cookie'
import Logo from './Logo';
import { useState,useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom";
import PreLoader from './PreLoader';

export default function Login(){
    const navigate = useNavigate()
    const [cookies, removeCookie] = useCookies([]);
    const [verificationProgress,setVerificationProgress] = useState(true)
    useEffect(()=>{
        const verifyCookie = async ()=>{
            if(!cookies.token){
              console.log(cookies.token)
              setVerificationProgress(false)
              return
            }
            const {data} = await axios.post("/",{},{withCredentials:true})
            const {status} = data
            console.log('log',status)
            setVerificationProgress(false)
            return status ? navigate("/") : navigate('/login');
        }
        verifyCookie()
    },[cookies,navigate,removeCookie])
    return(
      <>
        {verificationProgress?(
          <PreLoader/>
        ):(
          <div className='main-box'>
            <div className='left'>
              <Logo/>
              <div className='info'>
                doesn't let go of your claws!
              </div>
            </div>
            <div className='right'>
              <LoginBox/>
            </div>
        </div>
        )}
      </>
    )
  }

function LoginBox(){
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const [msg, setMsg] = useState('')
const navigate = useNavigate()

const handleLogin = async(e)=>{
    e.preventDefault()
    try{
    const response = await axios.post('/login',{username,password},{ withCredentials: true })
    if(response.data.success){
      setMsg('')
      setTimeout(()=>{
        navigate('/')
      },1000)
    }else{
      setMsg('*'+response.data.message)
    }
    }catch(error){
        console.log(error.message)
    }
}
return(
  <>
    <div className='login-box'>
      <form  onSubmit={handleLogin} method='POST'>
          <div className='input-box'>
          <label>Username</label>
          <input type='text' name='username' value={username} onChange={(e)=> setUsername(e.target.value)} required/>
          </div>
          <div className='input-box'>
          <label>Password</label>
          <input type='password' name='password' value={password} onChange={(e)=>setPassword(e.target.value)} required/>
          </div>
          <div className='forgot-line'><Link to="/forgot-password" className='links'>Forgot Password?</Link></div>
          <center><button id='login-btn'>Login</button></center>
      </form>
      <center>
          not have an account | <Link to="/create-new-account" className='links'><span className='create-line'>Create Here</span></Link><br/>
          <div className='login-msg'>
          {msg}
          </div>
      </center>
    </div>
  </>
)
}