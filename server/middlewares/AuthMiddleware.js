import LoginUsers from "../db/login_users.js";
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export const userVerification = (req,res) => {
    const token = req.cookies.token
    if(!token){
        return res.json({status:false})
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data)=>{
        if(err){
            return res.json({status:false})
        }else{
            const loginuser = await LoginUsers.findById(data.id)
            if(loginuser) return res.json({status:true,message:"success",username:loginuser.username})
            else return res.json({status:false,message:'failed'})
        }
    })
}