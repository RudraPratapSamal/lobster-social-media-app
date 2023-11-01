import FollowDetails from "../db/follow_details.js"
import LoginUsers from "../db/login_users.js"
import UserDetails from "../db/user_details.js"
import {createSecretToken} from '../util/SecretToken.js'
import bcrypt from 'bcrypt'
export const Signup = async (req,res,next) => {
    try {
        const loginUser = await req.body
        
        const emailCursor = await LoginUsers.find({email:loginUser.email},{email:1,_id:0})
        const usernameCursor = await LoginUsers.find({username:loginUser.username},{username:1,_id:0})
        if(emailCursor.length!==0 || usernameCursor.length!==0){
            const checkedEmail = emailCursor.length!==0
            const checkedUsername = usernameCursor.length!==0
            console.log({
                success:false,
                message: 'Please check all fields'
            })
            return res.json({
                success:false,
                email: checkedEmail,
                username:checkedUsername,
                message: 'Please check all fields'
            })
        }else{
            const user = {
                username:loginUser.username,
                fullname:loginUser.fullname,
                email:loginUser.email
            }
            const hash = await bcrypt.hash(loginUser.password, 10);
            loginUser.password = hash
            LoginUsers.create(loginUser)
            UserDetails.create(user)
            FollowDetails.create({
                requested_user:user.username,
                following_user:user.username,
                request_status:'y',
                dateTime:new Date()
            })
            const token = createSecretToken(loginUser._id)
            res.cookie('token',token,{
                withCredentials:true,
                httpOnly:false
            })
            res.status(201).json({success:true,message:'User signed up successfully'})
            next()
        }         
    } catch (error) {
        console.log(error)
    }
}
export const Login = async (req,res,next) =>{
    try {
        const user = await req.body
        const cursor = await LoginUsers.find({username:user.username})
        if(cursor.length===1){
            if(await bcrypt.compare(user.password,cursor[0].password)){
                const token = createSecretToken(cursor[0]._id)
                res.cookie('token',token,{
                    withCredentials:true,
                    httpOnly:false,
                })
                res.status(201).json({success:true,message:'Logged In Successfully'})
                next()
            }else{
                return res.json({
                    success:false,
                    message:"Please check your password"
                })
            }  
        }else{
            return res.json({
                success:false,
                message:"Username doesn't exist"
            })
        }
    } catch (error) {
        console.log(error.message,'heelo')
    }
}