import React,{useContext, useRef, useEffect, useState} from 'react'
import {Link, useHistory} from "react-router-dom"
import { UserContext } from '../../App'
import M from "materialize-css"

function Navbar() {
    const {state,dispatch}= useContext(UserContext)
    const [search, setSearch] = useState("")
    const [userDetails, setuserDetails] = useState([])
    const history = useHistory()
    const searchModal = useRef(null)

    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])

    const renderList = () =>{
        if (state){
            return[
                <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"white"}}>search</i></li>,
                <li key="2"><Link to="/myfeed">My Feed</Link></li>,
                <li key="3"><Link to="/createpost">Upload Post</Link></li>,
                <li key="4"><Link to="/followersPage">Followers Post</Link></li>,
                <li key="5"><button className="btn #000000 black" type="submit" onClick = {()=>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push('/login')
                }} >Logout</button></li>
            ]
        }else{
            return [
                <li key="6"><Link to="/login">Log-In</Link></li>,
                <li key="7"><Link to="/signup">Sign-Up</Link></li>
            ]
        }
    }

    const fetchUser = (query) =>{
        setSearch(query)
        fetch("http://localhost:1000/search-user",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query
            })
        }).then(res=>res.json())
        .then(results=>{
            setuserDetails(results.user)
            console.log(results)
        })
    }

    return (
        <div>
             <nav>
                <div className="nav-wrapper black">
                <Link to={state?"/":"/login"} className="brand-logo left text-white">Picture Gallery</Link>
                <ul id="nav-mobile" className="right ">
                    {renderList()}
                </ul>
                </div>
                <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
                    <div className="modal-content">
                        <label htmlFor="search">Search User</label>
                        <input type="text" placeholder="search user" value={search} onChange={(e)=>fetchUser(e.target.value)} />
                        <ul className="collection">
                            {userDetails.map(item=>{
                                return <Link to={item._id !== state._id ? '/profile/'+ item._id:'/profile'} onClick={()=>{M.Modal.getInstance(searchModal.current).close()
                                setSearch("")
                            }}><li className="collection-item" style={{color:"black"}}>{item.email}</li></Link>
                            })}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <a className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch("")}>Search</a>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
