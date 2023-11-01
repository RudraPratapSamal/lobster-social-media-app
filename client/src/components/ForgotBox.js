import React from 'react'

import Logo from './Logo';
import { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faCircleCheck, faL } from '@fortawesome/free-solid-svg-icons'
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom";
import axios from '../api/axios';
import {useCookies} from 'react-cookie'
import PreLoader from './PreLoader';

export default function ForgotBox(){

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
            return status ? navigate("/") : navigate('/forgot-password');
        }
        verifyCookie()
    },[cookies,navigate,removeCookie])

  const [email,setEmail] = useState('')
  const [username,setUsername] = useState('')
  const [avlUser,setAvlUser] = useState(null)
  const [avlEmail,setAvlEmail] = useState(null)
  const [uMsg,setUMsg] = useState('')
  const [eMsg,setEMsg] = useState('')

  async function handleUser(e){
    const user = {
      username:username,
    }
    try {
      const response = await axios.post('/api/user-availability',user,{
        method: 'POST',
        headers:{
          'Content-type': 'application/JSON',
        }
      })
      if(response.status===200){
        const data = await response.data
        if(data.success){
          if(username===''){
            setAvlUser(null)
            setUMsg('')
          }else{
            setAvlUser(false)
            setUMsg('*Username is not present')
          }
          console.log('success')
        }else{
          if(data.username){
            console.log(avlEmail)
            setAvlUser(true)
            setUMsg('')
          }
        }
      }
    } catch (error) {
        console.log(error.message)
    } 
  }

  async function handleEmail(){
    const user = {
      email:email,
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    // if(emailPattern.test(email)){
    //   try {
    //     const response = await fetch('http://localhost:5000/api/email-availability',{
    //       method: 'POST',
    //       headers:{
    //         'Content-type': 'application/JSON',
    //       },
    //       body: JSON.stringify(user),
    //     })
    //     if(response.ok){
    //       const data = await response.json()
    //       if(data.success){
    //         setAvlEmail(false)
    //         setEMsg("*E-mail doesn't exist")
    //         console.log('success email')
    //       }else{
    //         if(data.email){
    //           setAvlEmail(true)
    //           setEMsg('')
    //         }
    //       }
    //     }
    //   } catch (error) {
    //       console.log(error.message)
    //   } 
    // }else{
    //   if(email!==''){
    //     setAvlEmail(false)
    //     setEMsg('*Enter a valid email')
    //   }else{
    //     setAvlEmail(null)
    //     setEMsg('')
    //   }
    // }
    if(!emailPattern.test(email)){
      if(email!==''){
        setEMsg('*Enter a valid email')
      }else{
        setEMsg('')
      }
    }else{
      setEMsg('')
    }
  }
    return (
      <>
        {verificationProgress?(
          <PreLoader/>
        ):(
          <div className='forgot-box'>
            <Logo/>
            <form>
            <div className='input-box'>
                <label>Username</label> { avlUser!==null && (avlUser?<FontAwesomeIcon icon={faCircleCheck} className='green'/>:<FontAwesomeIcon icon={faCircleXmark} className='red'/>)}<br/>
                <input type='text'name='username' value={username} onChange={(e)=>setUsername(e.target.value)} onBlur={handleUser} required/>
                <div className='account-msg'>
                  {uMsg!=='' && uMsg}
                </div>
              </div>
              <div className='input-box'>
                <label>E-mail</label> 
                {/* {avlEmail!==null && (avlEmail?<FontAwesomeIcon icon={faCircleCheck} className='green'/>:<FontAwesomeIcon icon={faCircleXmark} className='red'/>)} */}
                <br/>
                <input type='text' name='email'value={email} onChange={(e)=>setEmail(e.target.value)} onBlur={handleEmail} required/>
                <div className='account-msg'>
                  {eMsg!=='' && eMsg}
                </div>
              </div>
              <center><button id='code-btn' disabled={!avlEmail || !avlUser}>Send Code</button></center>
            </form>
            <center>
              <div className='code-msg'>A code will be sent to your e-mail ID registered with your account.</div>
              <span className='create-line'><Link to="/login" className='links '>Login</Link> | <Link to="/create-new-account" className='links '>Signup</Link></span>
            </center>
          </div>
        )}
      </>
    )
  }