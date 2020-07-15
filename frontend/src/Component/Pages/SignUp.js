import React, {useState, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from "materialize-css"


function SignUp() {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [repassword, setRePassword] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState("") 
    const [url, setUrl] = useState(undefined) 
    const history = useHistory()

    useEffect(()=>{
        if (url){
            uploadFields()
        }
    },[url])

    const uploadPic = () =>{
        console.log(image)
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "Picture gallery")
        data.append("cloud_name", "siddtechbadal")
        fetch("https://api.cloudinary.com/v1_1/siddtechbadal/image/upload",{
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

     const uploadFields = () =>{
        fetch("http://localhost:1000/signup", {
            method:'post',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res => res.json())
        .then(data =>{
            if(data.error){
                M.toast({html: data.error, classes:"#f44336 red"})
            }else{
                M.toast({html: data.message, classes:"#00bfa5 teal accent-4"})
                history.push('/login')
            }
            console.log(data)
        }).catch(error=>{
            console.log(error)
        })

     }

    const PostData = () =>{
        if (image){
            uploadPic()
        }else{
            uploadFields()
        }
    }

    return (
        <div className="login-card">
            <div className="card auth-card">
                <form onSubmit={(e)=>{e.preventDefault();PostData()}}>
                    <div>
                        <h1 style={{textAlign:"center"}}>Sign-Up</h1>
                        <label htmlFor="name">Full-Name</label>
                        <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
                        <label htmlFor='email'>E-mail:</label>
                        <input type='email' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} />
                        <label htmlFor='password'>Password:</label>
                        <input type='password' placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} />
                        <label htmlFor='re-password'>ReType-Password:</label>
                        <input type='password' placeholder='Password' value={repassword} onChange={(e)=>setRePassword(e.target.value)} />
                        {/* <div className="file-field input-field">
                            <div className="btn">
                                <span>Select Picture</span>
                                <input type="file"  onChange={(e)=>{setImage(e.target.files[0])}} />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div> */}
                        <button className="btn waves-effect waves-light" type="submit">Log-In</button>
                    </div>
                    <div>    
                        <Link to="/login"><h6>Already have a account??</h6></Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp