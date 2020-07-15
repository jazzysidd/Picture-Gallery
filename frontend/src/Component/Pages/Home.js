import React,{useState, useEffect, useContext} from 'react'
import { UserContext } from '../../App'
import {Link} from "react-router-dom"

function Home() {
    const [data,setData] = useState([])
    const {state, dispatch}= useContext(UserContext)
    useEffect(() => {
        fetch('http://localhost:1000/findallpost',{
            headers:{
                "Authorization":"Hello " + localStorage.getItem('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result.posts)
        })
    }, [])

    const unlikePost = (id) => {
        fetch("http://localhost:1000/unlike",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Hello " + localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                postsId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData  = data.map(item=>{
                if (item._id==result._id){
                    return result
                }else {
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const likePost = (id) => {
        fetch("http://localhost:1000/like",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Hello " + localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                postsId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData  = data.map(item=>{
                if (item._id==result._id){
                    return result
                }else {
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const commentPost = (text, postsId) =>{
        fetch("http://localhost:1000/comment",{
            method:'put',
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Hello " + localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                postsId,
                text
            })
        }).then(res=>res.json()) 
        .then(result=>{
            console.log(result)
            const newData  = data.map(item=>{
                if (item._id==result._id){ 
                    return result
                }else {
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const deletePost = (postId) =>{
        fetch(`http://localhost:1000/deletepost/${postId}`,{
            method:"delete",
            headers:{
                Authorization:"Hello "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{ 
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    return (
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"5px"}} ><Link to={item.postedbyId._id !== state._id ? "/profile/"+item.postedbyId._id : "/profile/"+item.postedbyId._id}>{item.postedbyId.name}</Link> {item.postedbyId._id==state._id && <i className="material-icons" style={{float:"right"}} onClick={()=>deletePost(item._id)}>delete</i>}</h5>
                            <div className="card image">
                                <img src={item.photo} />
                        
                                <div className="card-content">
                                {item.likes.includes(state._id)?
                                <i className="material-icons" onClick={()=>{unlikePost(item._id)}}>thumb_down</i>:<i className="material-icons" onClick={()=>{likePost(item._id)}}>thumb_up</i>}                                
                                    <h6>{item.likes.length} likes</h6>
                                    <h4>{item.title}</h4>
                                    <p>{item.body}</p>
                                    {
                                        item.comments.map(record=>{
                                            return(
                                                <h6 key={record._id}><span style={{fontWeight:'500'}}>{record.postedbyId.name}</span> {record.text}</h6> 
                                            )
                                        })
                                    }
                                    <form onSubmit={(e)=>{
                                        e.preventDefault() 
                                        commentPost(e.target[0].value,item._id)
                                        console.log(e.target[0].value)
                                    }}>
                                        <input type="text" placeholder="comment something" />
                                    </form>
                                </div>
                            </div>
                        </div>

                    )
                })
            }
        </div>
    )
}

export default Home
