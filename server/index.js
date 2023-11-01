import express, { application } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import LoginUsers from './db/login_users.js'
import UserDetails from './db/user_details.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoute from './routes/AuthRoute.js'
import DeletedUsers from './db/deleted_users.js'
import { Login } from './controllers/AuthController.js'
import bcrypt from 'bcrypt'
import FollowDetails from './db/follow_details.js'
import PostsDetails from './db/posts_details.js'
import bodyParser from 'body-parser'
import { ConnectionClosedEvent } from 'mongodb'

dotenv.config()
const { MONGO_URL, PORT } = process.env;

const app = express()

app.use(bodyParser.json({limit:'10mb'}))
app.use(bodyParser.urlencoded({extended:true,limit:'10mb'}))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
app.use(cookieParser())
app.use('/',authRoute)


app.post('/api/user-availability',async(req,res)=>{
    try{
        const loginUser = await req.body
        
        const usernameCursor = await LoginUsers.find({username:loginUser.username},{username:1,email:1,_id:0})
        if(usernameCursor.length!==0){
            const checkedUsername = usernameCursor.length!==0
            res.json({
                success:false,
                username:checkedUsername
            })
        }else{
            res.json({
                success:true
            })
        }
         
    } catch(error){
        console.log(error.message)
    }
})

app.post('/api/email-availability',async(req,res)=>{
    try{
        const loginUser = await req.body
        
        const emailCursor = await LoginUsers.find({email:loginUser.email},{email:1,_id:0})
        if(emailCursor.length!==0){
            const checkedEmail = emailCursor.length!==0
            res.json({
                success:false,
                email: checkedEmail
            })
        }else{
            res.json({
                success:true
            })
        }    
    } catch(error){
        console.log(error.message)
    }
})

app.post('/api/account-details',async(req,res)=>{
    try {
        const account = await req.body
        const cursor = await LoginUsers.find({username:account.username})
        if(cursor){
            res.json({
                fullname:cursor[0].fullname,
            })
        }else{
            return
        }
    } catch (error) {
        console.log('fullname',error.message)
    }
})

app.post('/api/fetch-user-details',async(req,res)=>{
    try{
        const account = await req.body
        const cursor = await UserDetails.find({username:account.username})
        if(cursor.length>0){
            res.status(200).json({
                fname:cursor[0].fullname,
                bio:cursor[0].bio,
                ppic:cursor[0].profilepic,
                email:cursor[0].email
            })
        }else{
            res.status(404).json({ error: 'User not found' });
        }
    }catch(error){
        console.log("couldn't",error.message)
    }
})

app.post('/api/get-follow-count',async(req,res)=>{
    try {
        const username = await req.body.username
        const followers = await FollowDetails.find({$and:[{following_user:username},{request_status:'y'}]})
        const following = await FollowDetails.find({$and:[{requested_user:username},{request_status:'y'}]})
        const posts = await PostsDetails.find({username:username})
        res.status(200).json({
            followers:followers.length,
            following:following.length,
            posts:posts.length
        })
    } catch (error) {
        console.log('follow amount',error.message)
    }
})

app.post('/api/fetch-login-details',async(req,res)=>{
    try{
        const account = await req.body
        const cursor = await LoginUsers.find({username:account.username})
        if(cursor){
            res.json({
                mail:cursor[0].email
            })
        }else{
            console.log('fetch error')
            return
        }
    }catch(error){
        console.log(error.message)
    }
})

app.post('/api/delete-account',async(req,res)=>{
    try {
        const account = await req.body
        const deleteUser = await LoginUsers.find({username:account.username})
        if(await bcrypt.compare(account.password,deleteUser[0].password)){
            await LoginUsers.deleteOne({ username: account.username })
            await UserDetails.deleteOne({ username: account.username })
            await FollowDetails.deleteMany({$or:[{requested_user:account.username},{following_user:account.username}]})
            await PostsDetails.deleteMany({username:account.username})
                DeletedUsers.create({
                    fullname:deleteUser[0].fullname,
                    email:deleteUser[0].email,
                    dob:deleteUser[0].dob,
                    gender:deleteUser[0].gender,
                    username:deleteUser[0].username,
                    reason:account.reason
                })
                return res.json({success:true,msg:'Account Deleted Successfully'}) 
        }else{
            return res.json({success:false,msg:'Password is incorrect'})
        }
    } catch (error) {
        console.log(error)
    }
})

app.put('/api/update-profile',async(req,res)=>{
    try{
        const dataUpdation = req.body
        const updateProfile = await UserDetails.updateOne({username:dataUpdation.username},{$set:{
            fullname:dataUpdation.fname,
            email:dataUpdation.email,
            bio:dataUpdation.bio,
            profilepic:dataUpdation.ppic
        }})
        res.json(updateProfile)
    }catch(error){
        console.log('update profile error')
    }
})

app.post('/api/follow-profile-process',async(req,res)=>{
    try {
        const data=req.body.data
        const getFollowersData = await FollowDetails.find({$and:[{requested_user:data.ru},{following_user:data.fu}]})
        if(getFollowersData.length>0){
            if(getFollowersData[0].request_status===null){
                await FollowDetails.updateOne({$and:[{requested_user:data.ru},{following_user:data.fu}]},{$set:{
                    request_status:'n',
                    dateTime:new Date()
                }})
            }
            if(getFollowersData[0].request_status==='n' || getFollowersData[0].request_status==='y'){
                await FollowDetails.updateOne({$and:[{requested_user:data.ru},{following_user:data.fu}]},{$set:{
                    request_status:null,
                    dateTime:new Date()
                }})
            }
            res.json({status:null})
        }else{
            const cursor = await FollowDetails.create({
                requested_user:data.ru,
                following_user:data.fu,
                dateTime:new Date()
            })
            res.json({status:'n'})
        }
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/get-follow-status',async(req,res)=>{
    try {
        const data=req.body.data
        const getFollowersData = await FollowDetails.find({$and:[{requested_user:data.ru},{following_user:data.fu}]})
        if(getFollowersData.length>0){
            res.json({status:getFollowersData[0].request_status})
        }else{
            res.json({status:null})
        }
        
    }catch(error){
        console.log(error.message)
    }
})

app.post('/api/get-follow-users',async(req,res)=>{
    try {
        const data = req.body
        const title = data.title
        // console.log(data)
        if(title==="Followers"){
            const followers = await FollowDetails.find({$and:[{following_user:data.username},{request_status:'y'}]},{requested_user:1,_id:1})
            res.json(followers)
        }else if(title==='Following'){
            const following = await FollowDetails.find({$and:[{requested_user:data.username},{request_status:'y'}]},{following_user:1,_id:1})
            
            res.json(following)
        }
    } catch (error) {
        console.log('get follow users for follow modal',error.message)
    }
})

app.post('/api/get-all-usernames',async(req,res)=>{
    try {
        const pattern=req.body.term
        const cursorData = await UserDetails.find({$or:[
            {username:{$regex:`^${pattern}`,$options:'i'}},
            {fullname:{$regex:`^${pattern}`,$options:'i'}}]
        },{username:1,fullname:1,profilepic:1,_id:0})
        res.json(cursorData)
    } catch (error) {
        console.log('get-all-username for search',error.message)
    }
})

app.post('/api/get-follow-notifications',async(req,res)=>{
    try {
        const data=req.body
        const followData = await FollowDetails.find({$and:[{following_user:data.username},{$or:[{request_status:'n'},{request_status:'y'}]}]},{requested_user:1,request_status:1,dateTime:1,_id:0}).sort({dateTime:-1})
        res.json(followData)
    } catch (error) {
        console.log('follow-notifications',error.message)
    }
})

app.post('/api/update-follow-request',async(req,res)=>{
    try {
        const data=req.body
        if(data.rStatus=='a'){
            await FollowDetails.updateOne({$and:[{requested_user:data.ru},{following_user:data.fu}]},{$set:{
                request_status:'y'
            }})
        }else if(data.rStatus=='r'){
            await FollowDetails.updateOne({$and:[{requested_user:data.ru},{following_user:data.fu}]},{$set:{
                request_status:null
            }})
        }
    } catch (error) {
        console.log('update-follow-reqeust',error.message)
    }
})

app.post('/api/upload-post',async(req,res)=>{
    try {
        const data = req.body
        await PostsDetails.create({
            username:data.username,
            post_media:data.postMedia,
            post_caption:data.caption,
            dateTime:data.dateTime
        })
        res.status(200).json({status:'success'})
    } catch (error) {
        console.log('upload post',error.message)
    }
})

app.post('/api/get-profile-posts',async(req,res)=>{
    try {
        const username = req.body.username
        const allPosts = await PostsDetails.find({username:username},{__v:0}).sort({dateTime:-1})
        res.status(200).json(allPosts) 
    } catch (error) {
        console.log('all posts',error.message)
    }
})

app.post('/api/get-feed-posts',async(req,res)=>{
    try {
        const accounts = req.body
        const userArray = accounts.allUsers.map(user => user.following_user);
        const feedPosts = await PostsDetails.find({username:{$in:userArray}}).sort({dateTime:-1})
        res.status(200).json(feedPosts)
    } catch (error) {
        console.log('feed posts',error.message)
    }
})

app.post('/api/delete-profile-post',async(req,res)=>{
    try {
        const id = req.body.id
        const deleted = await PostsDetails.deleteOne({_id:id})
        res.json({deleted:deleted.acknowledged})
    } catch (error) {
        console.log('delete-profile-post',error.message)
    }
})

app.post('/api/update-post-likes',async(req,res)=>{
    try {
        const data = req.body
        const likeUsers = await PostsDetails.find({_id:data.id},{likes:1,_id:0})
        const users = likeUsers[0].likes
        if(data.hearted){
            const filteredUsers = users.filter(user=>user!==data.username)
            const response = await PostsDetails.updateOne({_id:data.id},{$set:{likes:filteredUsers}})
            res.status(200).json(response)
        }else{
            users.push(data.username)
            const response = await PostsDetails.updateOne({_id:data.id},{$set:{likes:users}})
            res.status(200).json(response)
        }
    } catch (error) {
        res.status(404)
        console.log('update post likes',error.message)
    }
})

app.post('/api/get-post-like-status',async(req,res)=>{
    try {
        const data = req.body
        const like = await PostsDetails.find({$and:[{_id:data.id},{likes:{$elemMatch:{$eq:data.likeUsername}}}]})
        res.json(like)
    } catch (error) {
        console.log('like status',error.message)
    }
})

app.post('/api/get-post-likes-count',async(req,res)=>{
    try {
        const data = req.body
        const likes = await PostsDetails.find({_id:data.id})
        res.json({likesCount:likes[0].likes.length})
    } catch (error) {
        console.log('post likes count',error.message)
    }
})

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>{
    console.log('mongoose connected successfully')
}).catch((error)=>{
    console.log(error)
})
app.listen(PORT,()=>console.log(`Server Running... ${PORT}`))