import React, {useState} from 'react'
import {Link, useHistory, useParams} from "react-router-dom"
import M from "materialize-css"

function ChangePassword() { 
    const [password, setPassword] = useState('')
    const History = useHistory("")
    const {token} = useParams()
    console.log(token)
    const PostLogin = () => {
        fetch('http://localhost:1000/new-password',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
            })
        }).then(res => res.json())
        .then(data =>{
            console.log(data)
            if (data.err){
                M.toast({html: data.err, classes:"#f44336 red"})
            }else{
                M.toast({html: data.message, classes:"#00bfa5 teal accent-4"})
                History.push('/login')
            }
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <div className="login-card">
            <div className="card auth-card">
                <form onSubmit={(e)=>{e.preventDefault();PostLogin()}}>
                    <div>
                        <h1 style={{textAlign:"center"}}>Type New Password</h1> 
                        <label htmlFor='password'>Password:</label>
                        <input type='password' placeholder='Enter New Password' value={password} onChange={(e)=>setPassword(e.target.value)} />
                        <button className="btn waves-effect waves-light" type="submit">Change Password</button>
                    </div>                    
                </form>   
            </div>
        </div>
    )
}

export default ChangePassword
