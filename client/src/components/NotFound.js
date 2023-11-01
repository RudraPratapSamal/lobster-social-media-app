import { Link } from "react-router-dom"
import Logo from "./Logo"

export default function NotFound(){
    console.log('usernotfound')
    return(
        <div className="main-feed">
            <div className="not-found">
                <h2>Sorry, this page isn't available.</h2>
                <p>
                    The link you followed may be broken, or the page may have been removed.<br/>Go back to <Link to='/' className="logo">lobster</Link>.
                </p>
                
            </div>                    
        </div> 

    )
}