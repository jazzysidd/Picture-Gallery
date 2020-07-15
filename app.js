const express = require("express")
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT || 1000

app.use(cors())

const dotenv = require("dotenv");
dotenv.config();



app.use(express.json())

const mongoose = require("mongoose")
const {MONGOURI} = require('./keys')

mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on("connected",()=>{
    console.log("connected to mongodb")
})
mongoose.connection.on("error",()=>{
    console.log("not connected to mongodb")
})

require('./models/user')
require('./models/post')


app.use(require('./Routes/index'))

if (process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"))
}

app.listen(PORT, ()=>{
    console.log("server running on 1000", PORT)
})