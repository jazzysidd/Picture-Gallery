const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const User = mongoose.model("User")
const jwt = require("jsonwebtoken")
const {JWT_secret} = require('../keys')
const crypto = require("crypto")
const token = require('../middleware/token')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))

router.post('/signup',(req,res)=>{
    const {name,email,password,pic} =req.body
    if(!email||!password||!name){
         res.status(422).json({error:"Please fill all fields"})
    }
    else{
        User.findOne({email:email})
        .then((savedUser)=>{
            if(savedUser){
                res.status(422).json({error:'User Already Exist with same Email-Id'})
        }
        bcrypt.hash(password, 15)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                pic
            })
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"no-reply@pictureGallery.com",
                    subject:"Signup Success",
                    html:"<h2>Welcome to Picture Gallery</h2>"
                })
                res.json({message:'Saved Succesfully'})
            })
            .catch(err=>{
                console.log(err)
            })
        })
    })    
    .catch(err=>{
        console.log(err)
    })
    }
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        res.status(422).json({err:"Please Provide Email or Password"})
    }
    else{
        User.findOne({email:email})
        .then(savedUser=>{
            if(!savedUser){
                res.status(422).json({err:"Invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){  
                const token = jwt.sign({_id:savedUser.id},JWT_secret)
                const{_id,name,email,followers,following, pic}=savedUser
                res.json({token,user:{_id, name, email, followers, following, pic}})
            }
            else{
                res.status(422).json({err:"Invalid Email or Password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
    }
    
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err, buffer)=>{
        if (err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User don't exist"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 360000
            user.save().then((result)=>[
                transporter.sendMail({
                    to:user.email,
                    from:'no-reply@pictureGallery.com',
                    subject:'password reset link',
                    html:`<P>You requested for password reset link</p>
                        <h6>click on this <a href="http://localhoast:3000/reset${token}">link</a> to reset password</h6>`
                    
                }),
                res.json({message:"Check Your Mail"})
            ])
        })
    })
})

router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Session Ecpired"})
        }
        bcrypt.hash(newPassword,15).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((savedUser)=>{
                res.json({message:"Password Succesfully Updated"})
            })
        })
    })
})

module.exports = router