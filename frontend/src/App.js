import React,{useEffect, createContext, useReducer, useContext} from 'react';
import './App.css';
import Navbar from './Component/Layout/Navbar';
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import Home from './Component/Pages/Home';
import Login from './Component/Pages/Login';
import SignUp from './Component/Pages/SignUp';
import Myprofile from './Component/Pages/myprofile';
import CreatePost from './Component/Pages/CreatePost';
import {intialState, reducer} from './Redux/userReducer'
import UserProfile from './Component/Pages/userPrfile';
import Subscriber from './Component/Pages/subscriberPost';
import Reset from './Component/Pages/reset';
import ChangePassword from './Component/Pages/newPassword';

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state,dispatch}= useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user')) 
    if (user){
      dispatch({type:"USER", payload:user})
      // history.push("/")
    }else{
      if(!history.location.pathname.startsWith('/reset'))
      history.push("/login")
    }
  },[])
    return(
      <Switch>
        <Route path="/" exact>
          <Home/>
        </Route>
        <Route path="/login">
          <Login/>
        </Route>
        <Route path="/signup">
          <SignUp/>
        </Route>
        <Route exact path="/myfeed">
          <Myprofile/>
        </Route>
        <Route path="/createpost">
          <CreatePost/>
        </Route>
        <Route path="/profile/:userid">
          <UserProfile/>
        </Route>
        <Route path="/followersPage">
          <Subscriber/>
        </Route>
        <Route exact path="/reset-password">
          < Reset/>
        </Route>
        <Route path="/reset-password/:token">
          < ChangePassword/>
        </Route>
      </Switch>
    )
}
function App() {
  const [state, dispatch] = useReducer(reducer,intialState)
  return (
    <div className="App">
      <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing/>
      </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
