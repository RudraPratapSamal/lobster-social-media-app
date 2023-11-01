import React,{useEffect,useState} from 'react'
import axios from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useOutletContext } from 'react-router-dom';
import Compressor from 'compressorjs'

export default function SettingDetails(){
    const [update,setUpdate]=useState(true)
    const username=useOutletContext()

    const [fullname,setFullname]=useState('')
    const [prevName,setPrevName]=useState('')

    const [email,setEmail]=useState('')
    const [newEmail,setNewEmail] = useState(null)
    const [prevEmail,setPrevEmail]=useState('')

    const [eMsg,setEMsg] = useState('')

    const [bio,setBio]=useState('')
    const [prevBio,setPrevBio]=useState('')

    const [pImage,setPImage]=useState('')
    const [prevPImage,setPrevPImage]=useState('')
    const [newPImage,setNewPImage]=useState(false)

    useEffect(()=>{
        const fethcDetails = async()=>{
            try{
                const userDetails = await axios.post('/api/fetch-user-details',{username:username})
                if(userDetails.status===200){
                    setFullname(userDetails.data.fname)
                    setBio(userDetails.data.bio)
                    setEmail(userDetails.data.email)
                    setPImage(userDetails.data.ppic)
                    setPrevEmail(userDetails.data.email)
                    setPrevBio(userDetails.data.bio!==null?userDetails.data.bio:'')
                    setPrevName(userDetails.data.fname)
                    setPrevPImage(userDetails.data.ppic)
                }
            }catch(error){
                console.log(error.message)
            }
        }
        fethcDetails()
    },[])

    async function handleEmail(){
        handleField()
        const user = {email:email}
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        if(emailPattern.test(email)){
            try {
              const response = await axios.post('/api/email-availability',user)
              if(response.status===200){
                const data = response.data
                if(data.success){
                  setNewEmail(true)
                  setEMsg('')
                }else{
                  if(email!==prevEmail && data.email){
                    setNewEmail(false)
                    setEMsg('*Email already exists')
                  }
                  else{
                    setNewEmail(true)
                    setEMsg('')
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

    function handleField(){
        console.log(newPImage)
        if((prevName!==fullname) || (prevBio!==bio) || (prevEmail!==email) || (prevPImage!==pImage) || newPImage){
            setUpdate(false)
        }
    }

    function handleImage(e){
        var reader = new FileReader()
        const image=e.target.files[0]
        new Compressor(image, {      
            quality: 0.2,
            success: (compressedResult) => {
                reader.readAsDataURL(compressedResult)
                reader.onload=()=>{
                    setPImage(reader.result)
                    setNewPImage(true)
                }
            },
          });
       
        reader.onerror=error=>{
            console.log("error",error)
        }
    }

    async function handleUpdate(){
        try{
            const formData = {
                username:username,
                fname:fullname,
                email:email,
                bio:bio,
                ppic:pImage
            }
            // console.log(formData)
            const response = await axios.put('/api/update-profile',formData)

        }catch(error){
            console.log(error.message)
        }
    }
    return(
        <div>
            <form>
                <div className='input-row'>
                    <label>
                        <div id="setting-ppic">
                            <center>
                                {/* {pImage} */}
                                <img src={(pImage===null)?'avatar.png':pImage}/>
                            </center>
                            <div id="change-box">Change Profile Photo</div>
                        </div>
                        <input type='file' accept='image/*' onChange={handleImage}/> 
                    </label>
                </div>
                <div className='input-row'>
                    <label className='label'>Fullname</label>
                    <input type='text' value={fullname} onChange={(e)=>setFullname(e.target.value)} onBlur={handleField} required/>
                </div>
                <div className='input-row'>
                    <label>E-mail {newEmail!==null && (newEmail?<FontAwesomeIcon icon={faCircleCheck} className='green'/>:<FontAwesomeIcon icon={faCircleXmark} className='red'/>)} <div className='account-msg'>
                        {eMsg!=='' && eMsg}
                    </div></label> 
                    <input type='text' value={email} onChange={(e)=>setEmail(e.target.value)} onBlur={handleEmail} required/>
                </div>
                <div className='input-row'>
                    <label>Bio</label>
                    <textarea type='text' value={bio} onChange={(e)=>setBio(e.target.value)} onBlur={handleField}/>
                </div>
                <div className='input-row'>
                    <center>
                        <button disabled={update} onClick={handleUpdate} className='update-btn'>Update</button>
                    </center>
                </div> 
            </form>
        </div> 
    )

}