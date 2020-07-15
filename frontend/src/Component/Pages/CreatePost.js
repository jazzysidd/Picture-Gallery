import React, {useState, useEffect} from 'react'
import M from "materialize-css"
import {useHistory} from 'react-router-dom'

function CreatePost() {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl]=useState("")
    const history = useHistory('')

    useEffect(() => {
        if (url){
            fetch("http://localhost:1000/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Hello " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                picUrl:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if (data.err){
                M.toast({html:data.err,classes:"#f44336 red"})
            }else{
                M.toast({html:"Pic Uploaded", classes:'#00bfa5 teal accent-4'})
                history.push("/")
            }
        })
        }
    }, [url])
    
    const PostPicture = () => {
        const data = new FormData()
        data.append('file',image)
        data.append('upload_preset',"Picture gallery")
        data.append('cloud_name','siddtechbadal')
        
        fetch("	https://api.cloudinary.com/v1_1/siddtechbadal/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
            console.log(data)
        }).catch(err=>{
            console.log(err)
        })
    }
    
    return (
        <div className="card input-field" style={{margin:'50px auto', maxWidth:"500px", padding:"20px"}}>
            <form onSubmit={(e)=>{e.preventDefault();PostPicture()}}>
                <label htmlFor="title">Title</label>
                <input type="text" placeholder="title" value={title} onChange={(e)=>setTitle(e.target.value)} />
                <label htmlFor="body">Body</label>
                <input type="text" placeholder="body" value={body} onChange={(e)=>{setBody(e.target.value)}} />
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Select Picture</span>
                        <input type="file"  onChange={(e)=>{setImage(e.target.files[0])}} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light" type="submit">Upload</button>  
            </form>
            
        </div>
    )
}

export default CreatePost