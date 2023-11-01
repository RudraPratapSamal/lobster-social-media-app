import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import DotsLoader from "./DotsLoader";

export default function Thanks(){
    const navigate = useNavigate()
    setTimeout(()=>{
        navigate('/login')
    },20000)
    return(
        <div className="last-page">
            <div className="left">
                <Logo/>
            </div>
            <div className="info">
                Thank You for being with us!
            </div>
            <div className="redirect-msg">
                redirecting to login page
            </div>
            <DotsLoader/>
        </div>
    )
}