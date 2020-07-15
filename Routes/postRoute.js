const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const token = require('../middleware/token')
const Post =  mongoose.model("Post")

router.post('/createpost',token,(req,res)=>{
    const {title, body, picUrl} = req.body
    if(!title|| !body || !picUrl){
        return res.status(422).json({err:"Please fill all fields"})
    }
    req.user.password=undefined
    const post = new Post({
        title,
        body,
        photo:picUrl,
        postedbyId:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })

})

router.get('/findallpost',token,(req,res)=>{
    Post.find()
    .populate('postedbyId',"_id name")
    .populate("comments.postedbyId","_id name")
    .sort("-createdAt")
    .then(posts=>{
        res.json({posts})
    }) 
    .catch(err=>{
        console.log(err)
    })
})

router.get('/subscriberPost',token,(req,res)=>{
    Post.find({postedbyId:{$in:req.user.following}})
    .populate('postedbyId',"_id name")
    .populate("comments.postedbyId","_id name")
    .sort("-createdAt")
    .then(posts=>{
        res.json({posts})
    }) 
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',token,(req,res)=>{
    Post.find({postedbyId:req.user._id})
    .populate("postedbyId","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like', token,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postsId,{
        $push:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedbyId","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike', token,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postsId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    })
    .populate("postedbyId","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment', token,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedbyId:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postsId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedbyId","_id name")
    .populate("postedbyId","_id name")   
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete("/deletepost/:postId",token,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedbyId","_id")
    .exec((err,post)=>{
        if(err||!post){
            return res.status(422).json({error:err})
        }
        if (post.postedbyId._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})


module.exports = router