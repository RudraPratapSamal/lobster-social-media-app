import mongoose, { mongo } from "mongoose"

const postsDetailsSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            lowercase:true,
            required: true
        },
        post_media:{
            type: String,
            required: true
        },
        post_caption:{
            type: String
        },
        dateTime:{
            type: Date,
            required: true
        },
        likes:{
            type:[String],
            default:[]
        }
    }
)

const PostsDetails = mongoose.model('posts_details',postsDetailsSchema)

export default PostsDetails