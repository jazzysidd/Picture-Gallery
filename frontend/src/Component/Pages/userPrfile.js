import React,{useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import {useParams} from "react-router-dom"

function Userprofile() {
    const [userProfile, setProfile]=useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [setFollow, setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(() => {
        fetch(`http://localhost:1000/user/${userid}`,{
            headers:{  
                "Authorization":"Hello " +localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setProfile(result)
        })
    }, [])

    const followUser = () =>{
        fetch("http://localhost:1000/follow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Hello "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}}) 
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
            console.log(data)
        })
    }

    const unfollowUser = () =>{
        fetch("http://localhost:1000/unfollow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Hello "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}}) 
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id)
                return{
                    ...prevState,
                    user:{...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setShowFollow(true)
            console.log(data)
        })
    }

    return (
        <>
        {userProfile ?
        <div style={{maxWidth:"600px", margin:'10px auto'}}>
            <div style={{display:"flex", justifyContent:"space-around", margin:"20px 20px", borderBottom:"1px solid grey"}}>
                <div>
                    <img style={{width:'160px',height:"160px",borderRadius:"80px"}} src={userProfile.user.pic} />
                </div>
                <div>
                    <h4>{userProfile.user.name }</h4>
                    <div style={{display:"flex", justifyContent:"space-between", width:"110%"}}>
                        <h6>{userProfile.posts.length} Post</h6>
                        <h6>{userProfile.user.followers.length} Followers</h6>
                        <h6>{userProfile.user.following.length} Following</h6>
                    </div>
                    {setFollow?
                    <button className="btn waves-effect waves-light" type="submit" onClick={()=>followUser()}>Follow</button>
                    :
                    <button className="btn waves-effect waves-light" type="submit" onClick={()=>unfollowUser()}>UnFollow</button>                
                    }
                </div>
            </div>

            <div className="gallery" style={{display:"flex", justifyContent:"space-around", flexWrap:"wrap"}}>
                {
                    userProfile.posts.map(item=>{
                        return(
                            <img key={item._id} className="galleryItem" src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div>
        </div>   

        : <h2>loading!...</h2>}
        
        </>
    )
}

export default Userprofile