import mongoose, {model, mongo} from "mongoose";

const userDetailsSchema = new mongoose.Schema(
    {
        fullname:{
            type: String,
            reuired: true
        },
        username:{
            type: String,
            reuired: true,
            unique:true
        },
        email:{
            type: String,
            lowercase:true,
            reuired: true,
            unique:true
        },
        bio:{
            type: String,
            default:null
        },
        profilepic:{
            type: String,
            default:null
        }
})

const UserDetails = mongoose.model('user_details',userDetailsSchema)

export default UserDetails