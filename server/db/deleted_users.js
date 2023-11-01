import mongoose, { mongo } from "mongoose"

const deletedUsersSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true
        },
        email:{
            type: String,
            lowercase:true,
            required: true,
            unique:false
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
            unique:false
        },
        reason:{
            type: String,
            required: true
        }
    }
)

const DeletedUsers = mongoose.model('deleted_users',deletedUsersSchema)

export default DeletedUsers