import { useState } from "react"
import { useNavigate, useOutletContext, useOutletusername } from "react-router-dom"
import axios from "../api/axios"
import {useCookies} from 'react-cookie'
export default function SettingsDeleteAccount(){
    const navigate = useNavigate()
    const [cookies, removeCookie] = useCookies([]);
    const username = useOutletContext()
    const values=["didn't find it fun","created another account","don't want to share"]
    const [passowrd,setPassword]= useState('')
    const [reason,setReason]=useState('')
    const [msg,setMsg]=useState('')
    function handleSelect(e){
        setReason(e.target.value)
    }
    function handlePassword(){
        if(passowrd===''){
            setMsg('')
        }
    }
    async function deleteAccount(){
        try {
            const details={
                username:username,
                reason:reason,
                password:passowrd
            }
            const response = await axios.post('/api/delete-account',details)
            if(response.data.success){
                setMsg('')
                // removeCookie('token')
                navigate('/deleted-account')
            }
            else{
                setMsg('*'+response.data.msg)
            }
            console.log(msg)
        } catch (error) {
            console.log(error.message)
        }
    }
    return(

        <div className="delete-account">
            <h2>Delete Your Account</h2>
            <p>
                Would you like to share, why do you want to delete <strong>{username}</strong>&nbsp;<p/>
                <select id='delete-reason' onChange={handleSelect}>
                    <option value=''>---</option>
                    <option value={values[0]}>{values[0]}</option>
                    <option value={values[1]}>{values[1]}</option>
                    <option value={values[2]}>{values[2]}</option>
                </select>
            </p>
            <label>Please enter your password</label><br/>
            <input type="password" value={passowrd} onChange={(e)=>{setPassword(e.target.value)}} onBlur={handlePassword} required/><br/>
            <div className="login-msg">{msg}</div>
            <p id="delete-msg">
                *By clicking Confirm Delete, you acknowledge that your profile details and data will be deleted from the very instant.
            </p>
            
            <button onClick={deleteAccount}>Confirm Delete</button>
            {/* Do you really want to delete account? <button>Yes</button> <button>No</button> */}
        </div> 
    )
}