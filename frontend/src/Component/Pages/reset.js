import React, {useState, useContext} from 'react'
import {Link, useHistory} from "react-router-dom"
import M from "materialize-css"
import {UserContext} from '../../App'

function Reset() {
    const [email, setEmail] = useState('')
    const History = useHistory("")
    
    const PostLogin = () => {
        fetch('http://localhost:1000/reset-password',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
               
            })
        }).then(res => res.json())
        .then(data =>{
            if (data.err){
                M.toast({html: data.err, classes:"#f44336 red"})
            }else{
                M.toast({html:data.message, classes:"#00bfa5 teal accent-4"})
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
                        <h1 style={{textAlign:"center"}}>Reset-Password</h1>
                        <label htmlFor='email'>E-mail:</label>
                        <input type='email' placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} /> 
                        <button className="btn waves-effect waves-light" type="submit">Reset-Password</button>
                    </div>        
                    <div>
                        <h6><Link to="/signup">Have a Account?</Link></h6>
                    </div>          
                </form>   
            </div>
        </div>
    )
}

export default Reset
