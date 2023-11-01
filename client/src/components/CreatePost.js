import React,{useEffect, useState} from 'react'
import {useNavigate } from 'react-router-dom';
import {useCookies} from 'react-cookie'
import axios from '../api/axios';
import PreLoader from './PreLoader';
import { HiOutlineCamera } from "react-icons/hi2";
import Compressor from 'compressorjs'
import { ToastContainer, toast } from "react-toastify";
export default function CreatePost(){
    const navigate = useNavigate()
    const [cookies, removeCookie] = useCookies([]);
    const [verificationProgress,setVerificationProgress] = useState(true)

    const [username,setUsername]=useState('')
    const [caption,setCaption]=useState('')
    const [postMedia,setPostMedia]=useState(null)
    const [buttonTitle,setButtonTitle]=useState('Post')

    useEffect(()=>{
        const verifyCookie = async ()=>{
            if(!cookies.token){
                navigate('/login')
            }
            const {data} = await axios.post("/",{},{withCredentials:true})
            const {status,username} = data
            setUsername(username)
            setVerificationProgress(false)
            return !status && (removeCookie("token"), navigate("/login"));
        }
        verifyCookie()
    },[cookies,navigate,removeCookie])

    function handleImage(e){
        var reader = new FileReader()
        const image=e.target.files[0]
        new Compressor(image, {      
            quality: 0.2,
            success: (compressedResult) => {
                reader.readAsDataURL(compressedResult)
                reader.onload=()=>{
                    setPostMedia(reader.result)
                }
            },
          });
       
        reader.onerror=error=>{
            console.log("error",error)
        }
    }

    async function handleUpload(){
        setButtonTitle(<PreLoader/>)
        try {
            const response=await axios.post('/api/upload-post',{
                username:username,
                postMedia:postMedia,
                caption:caption,
                dateTime: new Date()
            })
            if(response.data.status==='success'){
                toast.success("Memory uploaded successfully!",{
                    position:'top-center',
                    hideProgressBar:true
                })
                setTimeout(()=>{
                    navigate(`/${username}`)
                },1000)
            }
        } catch (error) {
            toast.error("Something went wrong! You can try again",{
                position:'top-center',
                hideProgressBar:true
            })
            setTimeout(()=>{
                navigate('/create-your-post')
            },1000)
            console.log('upload post',error.message)
        }
    }

    return(
        <>
            {verificationProgress?(
                <PreLoader/>
            ):(
                <div className='main-feed'>
                    <div className='create-post'> 
                        <label>
                            <div className="create-post-icon">
                                {postMedia===null?(
                                    <div className="browse-icon">
                                        <span>
                                        <HiOutlineCamera/>
                                    </span>
                                    browse your memory  
                                    </div>
                                ):(
                                    <center>
                                        <img src={postMedia}/>
                                    </center>
                                )}   
                                <input type='file' accept="image/*" onChange={handleImage}/>
                            </div>
                        </label>
                        <textarea type='text' value={caption} onChange={(e)=>setCaption(e.target.value)}/>
                        <center>
                            <button onClick={handleUpload}>{buttonTitle}</button>
                        </center>
                    </div>
                </div>
            )}
            <ToastContainer/>
        </>
    )
}