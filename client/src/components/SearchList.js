import { useEffect, useState } from "react"
import axios from "../api/axios"
import SearchListUser from "./SearchListUser"


export default function SearchList(){
    const [searchTerm,setSearchTerm]=useState('')
    const [items,setItems]=useState([])

    useEffect(()=>{
        async function fetchData(){
            try {
                if(searchTerm.length>1){
                    const response = await axios.post('/api/get-all-usernames',{term:searchTerm})
                    setItems(response.data)
                    console.log(items)
                }else{
                    setItems([])
                }
            } catch (error) {
                console.log('search users fetchData',error.message)
            }
        }
        fetchData()
    },[searchTerm])

    function handleSearchTerm(e){
        setSearchTerm(e.target.value)
    }
    return(
        <div className="main-feed">
            <div className="search-list-box">
                <center>
                    <input type='search' placeholder='Search...' value={searchTerm} onChange={handleSearchTerm}/>
                </center>
                <div>
                    {searchTerm.length>1?
                    <ul>
                        {items.map((item, index) => (
                            <SearchListUser item={item} index={index}/>
                        ))}
                    </ul>:null}
                </div>
            </div>
        </div>        
    )
}