import mongoose, { mongo } from "mongoose"

const followDetailsSchema = new mongoose.Schema(
    {
        requested_user: {
            type: String,
            lowercase:true,
            required: true
        },
        following_user:{
            type: String,
            lowercase:true,
            required: true
        },
        request_status:{
            type: String,
            lowercase:true,
            required: true,
            default:'n'
        },
        dateTime:{
            type: Date,
            required: true
        }
    }
)

const FollowDetails = mongoose.model('follow_details',followDetailsSchema)

export default FollowDetails