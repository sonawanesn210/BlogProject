const express= require('express')
const routes= require('./routes/routes')
var bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect("mongodb+srv://Uranium-Batch:aruSjkdGdfhc9MRK@functionup.eel5r.mongodb.net/BlogProjectpractice1",{useNewUrlParser:true})
.then(()=>{
    console.log("Mongodb is connected")
})
.catch((error)=>{
    console.log("Database connection error"+ error)
})
app.use('/',routes)

app.listen(process.env.PORT||3000,()=>{
    console.log("Express is running on port " +(process.env.PORT||3000))
})