import mongoose, { mongo } from "mongoose"

const loginUsersSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true
        },
        email:{
            type: String,
            lowercase:true,
            required: true,
            unique:true
        },
        dob:{
            type: Date,
            required: true
        },
        gender:{
            type: String,
            required: true
        },
        username:{
            type: String,
            required: true,
            unique:true
        },
        password:{
            type: String,
            required: true
        },
    },
    {
        timestamp: true
    }
)

const LoginUsers = mongoose.model('login_users',loginUsersSchema)

export default LoginUsers