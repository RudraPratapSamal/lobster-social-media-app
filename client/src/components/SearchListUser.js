import { Link } from "react-router-dom"
export default function SearchListUser({item,index}){
    return(
        <Link to={`/${item.username}`} className="user-links" key={index}>
            <li key={index}>
                <div className='search-user-pic'>
                    <img src={item.profilepic!==null && item.profilepic!==''?`${item.profilepic}`:'avatar.png'}/>
                </div>
                <div className='search-user-body'>
                    <div className='search-username'>{item.fullname}</div>
                    <div className='search-fullname'>@{item.username}</div>
                </div>
            </li>
        </Link>
    )
}