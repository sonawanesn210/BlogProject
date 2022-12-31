const authorModel = require('../models/authorModel')
const validate = require('../validators/validations')
const jwt =require('jsonwebtoken')
const createAuthor = async (req, res) => {
    try {

        let data = req.body
       
        
        if(!validate.isValidBody(data)){
            return res.status(400).send({status:false,message:"Please Enter Data"})
        }
        let{fname,lname,title,email,password}=data
        if(!fname){
            return res.status(400).send({status:false,message:"Enter first Name"})
        }
        if(!validate.isValidString(fname)){
            return res.status(400).send({status:false,message:"Enter valid firstName"})
        }

        if(validate.isNumber(fname)){
            return res.status(400).send({status:false,message:"First Name should not contain number"})
        }

         if(!lname){
            return res.status(400).send({status:false,message:"Enter last Name"})
        }
        if(!validate.isValidString(lname)){
            return res.status(400).send({status:false,message:"Enter valid lastName"})
        }

        if(validate.isNumber(lname)){
            return res.status(400).send({status:false,message:"Last Name should not contain number"})
        }

        if(!title){
            return res.status(400).send({status:false,message:"Please enter Title"})
        }
        if(!validate.isValidTitle(title)){
            return res.status(400).send({status:false,message:`Title must contain on "Mr","Miss","Mrs"`})
        }
        if(!email){
            return res.status(400).send({status:false,message:"Please enter email"})
        }
        if(!validate.isValidEmail(email)){
            return res.status(400).send({status:false,message:"Please Enter valid email"})
        }

        let findEmail =await authorModel.findOne({email:email})
        if(findEmail){
            return res.status(400).send({status:false,message:`${data.email} is already present ,enter another email`})
        }

        if(!password){
            return res.status(400).send({status:false,message:"Please Enter password"})
        }

        if(!validate.isValidPassword(password)){
            return res.status(400).send({status:false,message:"Password should have min 8 characters And max 13 characters with ateast one capital letter, one number and one special character"})
        }
      
        const createAuthorData =await authorModel.create(data)
        return res.status(201).send({status:false,message:"Author created successfully",data:createAuthorData})

    }
    catch (error) {
        return res.status(500).send({ status: false, error: error.message })
    }
}

//--------------------------------------------------//
const loginAuthor =async (req,res)=>{
    try{
       let data=req.body

       if(!validate.isValidBody(data)){
        return res.status(400).send({status:false,message:"Please enter data"})
       }
    if(!data.email){
        return res.status(400).send({status:false,message:"Please enter Email"})
    }
    if(!validate.isValidEmail){
        return res.status(400).send({status:false,message:"Enter valid Email"})
    }
    if(!data.password){
        return res.status(400).send({status:false,message:"please enter password"})
    }
    const findEmailPassword=await authorModel.findOne({email:data.email,password:data.password})
    if(!findEmailPassword){
        return res.status(401).send({status:false,message:"Invalid Login credentials"})
    }
    let token =jwt.sign({userId:findEmailPassword._id},"BlogProject")
     
    res.setHeader("x-api-key",token)
    res.status(200).send({status:true,message:"Login successfully",token:token})


    }
    catch(error){
        res.status(500).send({status:false,error:error.message})
    }
}


module.exports = { createAuthor,loginAuthor }