import axios from '../api/axios';
import Logo from './Logo';
import React, { useState,useEffect } from 'react';
import {useCookies} from 'react-cookie'
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faCircleCheck, faL } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer, toast } from "react-toastify";
import PreLoader from './PreLoader';

export default function CreateAccountBox(){
    const navigate = useNavigate()
    const [cookies, removeCookie] = useCookies([]);
    const [verificationProgress,setVerificationProgress] = useState(true)
    useEffect(()=>{
      const verifyCookie = async ()=>{
          if(!cookies.token){
            setVerificationProgress(false)
            return
          }
          const {data} = await axios.post("/",{},{withCredentials:true})
          const {status} = data
          console.log('acc',status)
          setVerificationProgress(false)
          return status ? navigate("/") : navigate('/create-new-account');
      }
      verifyCookie()
    },[cookies,navigate,removeCookie])

    const [fullname,setFullname] = useState('')
    const [email,setEmail] = useState('')
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [cpassword,setCPassword] = useState('')
    const [pMsg,setPMsg] = useState('')
    const [uMsg,setUMsg] = useState('')
    const [eMsg,setEMsg] = useState('')
    const [dMsg,setDMsg] = useState('')
    const [strength,setStrength] = useState({})
    const [newUser,setNewUser] = useState(null)
    const [newEmail,setNewEmail] = useState(null)
    const [matchPassword,setMatchPassword] = useState(null)
    const gender = {
      male:'m',
      female:'f',
      others:'o'
    }

    async function handleSubmit(e){
      e.preventDefault()
      const user = {
        fullname:fullname,
        email:email,
        username:username,
        password:password,
        dob:e.target.dob.value,
        gender:e.target.gender.value
      }
      if(password!==cpassword){
        toast.error("Please check all fields",{
          position:'top-center',
          hideProgressBar:true
        })
        return
      }
      try {
        const response = await axios.post('/create-account',user,{withCredentials: true})
        console.log(response)
        if(response.data.success && password===cpassword){
          toast.success(response.data.message,{
            position:'top-center',
            hideProgressBar:true
          })
          setTimeout(()=>{
            navigate('/')
          },1000)
        }else{
          toast.error(response.data.message,{
            position:'top-center',
            hideProgressBar:true
          })
        }
      } catch (error) {
          console.log(error.message,'hey')
      }
    }
  
    function handleDate(e){
      const dob = new Date(e.target.value)
      const checkDob = Math.floor((new Date() - dob)/(1000*60*60*24*365))
      if(checkDob>100 || checkDob<=0){
        setDMsg('*Please enter a valid Date Birth')
      }else if(checkDob<12){
        console.log('Age must be more than 12')
        setDMsg('*Age must be more than 12')
      }else{
        setDMsg('')
      }
    }
    
    function handlePassword(){
      if(password==='' && cpassword===''){
        setMatchPassword(null)
        setPMsg('')
      }else if((password==='' || cpassword==='') || password!==cpassword){
        setMatchPassword(false)
        setPMsg("*Password doesn't match")
      }else{
        setMatchPassword(true)
        setPMsg('')
      }
    }
  
    async function handleUser(e){
      const user = {
        username:username,
      }
      try {
        const response = await axios.post('/api/user-availability',user,{
          headers:{
            'Content-type': 'application/JSON',
          }
        })
        if(response.status===200){
          const data = response.data
          if(data.success){
            if(username===''){
              setNewUser(null)
            }else{
              setNewUser(true)
            }
            setUMsg('')
            console.log('Username Available')
          }else{
            if(data.username){
              setNewUser(false)
              setUMsg('*Username is not available')
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
      if(emailPattern.test(email)){
        try {
          const response = await axios.post('/api/email-availability',user,{
            headers:{
              'Content-type': 'application/JSON',
            }
          })
          if(response.status===200){
            const data = response.data
            if(data.success){
              setNewEmail(true)
              setEMsg('')
              console.log('success email')
            }else{
              if(data.email){
                setNewEmail(false)
                setEMsg('*Email already exists')
              }
            }
          }
        } catch (error) {
            console.log(error.message)
        } 
      }else{
        if(email!==''){
          setNewEmail(false)
          setEMsg('*Enter a valid email')
        }else{
          setNewEmail(null)
          setEMsg('')
        }
      }
    }
  
    function checkStrength(){
      const pass = {
        length:'f',
        spl:'f',
        up:'f',
        low:'f',
        num:'f'
      }
      if (password.length >= 8) {
        pass.length='p'
      }else{
        pass.length='f'
      }
      if (/[A-Z]/.test(password)) {
        pass.up='p'
      }else{
        pass.up='f'
      }
      if (/[a-z]/.test(password)) {
        pass.low='p'
      }else{
        pass.low='f'
      }
      if (/[!@#$%^&*]/.test(password)) {
        pass.spl='p'
      }else{
        pass.spl='f'
      }
      if (/[0-9]/.test(password)) {
        pass.num='p'
      }else{
        pass.num='f'
      }
      console.log(pass)
    }
  
    return(
      <>
      {verificationProgress?(
        <PreLoader/>
      ):(
        <>
          <div className='account-box'>
            <Logo/>
            <form onSubmit={handleSubmit} method='POST'>
              <div className='input-box'>
                <label>Full Name</label><br/>
                <input type='text'name='fullname' value={fullname} onChange={(e)=>setFullname(e.target.value)} required/>
              </div>
              <div className='input-box'>
                <label>E-mail</label> {newEmail!==null && (newEmail?<FontAwesomeIcon icon={faCircleCheck} className='green'/>:<FontAwesomeIcon icon={faCircleXmark} className='red'/>)}<br/>
                <input type='text' name='email'value={email} onChange={(e)=>setEmail(e.target.value)} onBlur={handleEmail} required/>
                <div className='account-msg'>
                  {eMsg!=='' && eMsg}
                </div>
              </div>
              <div className='input-box'>
                <label>Date of Birth</label><br/>
                <input type='date' name='dob' onBlur={handleDate} required/>
                <div className='account-msg'>
                  {dMsg!=='' && dMsg}
                </div>
              </div>
              <div className='input-box gender-box'>
                <label>Gender</label>
                <label id='gender'>
                  <input type='radio' value={gender.male} name='gender'/>
                  Male
                </label>
                <label id='gender'>
                  <input type='radio' value={gender.female} name='gender'/>
                  Female
                </label>
                <label id='gender'>
                  <input type='radio' value={gender.others} name='gender'/>
                  Other
                </label>
              </div>
              <div className='input-box'>
                <label>Username</label> { newUser!==null && (newUser?<FontAwesomeIcon icon={faCircleCheck} className='green'/>:<FontAwesomeIcon icon={faCircleXmark} className='red'/>)}<br/>
                <input type='text'name='username' value={username} onChange={(e)=>setUsername(e.target.value)} onBlur={handleUser} required/>
                <div className='account-msg'>
                  {uMsg!=='' && uMsg}
                </div>
              </div>
              <div className='input-box'>
                <label>Password</label><br/>
                <input type='password' name='new_pass'value={password} onChange={(e)=>setPassword(e.target.value)} onInput={checkStrength} required/>
              </div>
              <div className='input-box'>
                <label>Confirm Password</label> {matchPassword!==null && (matchPassword?<FontAwesomeIcon icon={faCircleCheck} className='green'/>:<FontAwesomeIcon icon={faCircleXmark} className='red'/>)}<br/>
                <input type='password' name='confirm_pass'value={cpassword} onChange={(e)=>setCPassword(e.target.value)} onBlur={handlePassword} required/>
                <div className='account-msg'>
                  {pMsg!=='' && pMsg}
                </div>
              </div>
              <center><button id='create-btn'>Create Account</button></center>
            </form>
            <div className='code-msg'>
              <center>Already have an account | <Link to='/login' className='links create-line'>Login</Link></center>
            </div>    
          </div>
        <ToastContainer/>
      </>
      )
      }
      </>
    )
  }