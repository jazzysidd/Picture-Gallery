import React, {useState, useContext} from 'react'
import {Link, useHistory} from "react-router-dom"
import M from "materialize-css"
import {UserContext} from '../../App'

function Login() {
    const {state,dispatch} = useContext(UserContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const History = useHistory("")
    
    const PostLogin = () => {
        fetch('http://localhost:1000/signin',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
        .then(data =>{
            console.log(data)
            if (data.err){
                M.toast({html: data.err, classes:"#f44336 red"})
            }else{
                localStorage.setItem('jwt',data.token)
                localStorage.setItem('user',JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user})
                M.toast({html: "Signed-In", classes:"#00bfa5 teal accent-4"})
                History.push('/')
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
                        <h1 style={{textAlign:"center"}}>Log-In</h1>
                        <label htmlFor='email'>E-mail:</label>
                        <input type='email' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} /> 
                        <label htmlFor='password'>Password:</label>
                        <input type='password' placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value)} />
                        <button className="btn waves-effect waves-light" type="submit">Log-In</button>
                    </div>
                    <div>
                        <h6><Link to="/signup">Don't have a account?</Link></h6>
                    </div>                    
                    <div>
                        <p><Link to="/reset-password">Forgot Password?</Link></p>
                    </div>                    
                </form>   
            </div>
        </div>
    )
}

export default Login
