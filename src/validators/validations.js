const { default: mongoose } = require("mongoose")


const isValidBody = (reqBody)=>{
    return Object.keys(reqBody).length>0
}

const isValidString=(string)=>{
    return  /^[a-zA-Z]/.test(string.trim())
}

const isNumber=(number)=>{
    return /\d/.test(number)
}

const isValidObjectId=(objectId)=>{
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isValidEmail=(email)=>{
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.trim())
}

const isValidPassword=(password)=>{
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password.trim())
}

const isValidTitle= (title)=>{
    return ["Mr","Miss","Mrs"].includes(title.trim())
}

module.exports={isValidBody,isNumber,isValidEmail,isValidObjectId,isValidPassword,isValidTitle,isValidString}