const jwt=require('jsonwebtoken')
const validate=require('../validators/validations')
const blogModel =require('../models/blogModel')
const authorModel=require('../models/authorModel')

const authentication =async (req,res,next)=>{
    try{
        let token = req.headers['x-api-key']||req.headers['x-Api-Key']
        if(!token){
            return res.status(403).send({status:false,message:"Please provide token"})
        }

        let decodedToken =jwt.verify(token,"BlogProject",function(err){
            if(err){
                return res.status(403).send({status:false,message:"Invalid Token"})
            }else{
                next()
            }
        })
    }
    catch(error){
        res.status(500).send({status:false,error:error.message})
    }
}


//---------------------------------------------------//

 const authorisation = async (req,res,next)=>{

   try{

    let token =req.headers['x-api-key']||req.headers['x-Api-Key']

    const id= req.params.blogId;
    console.log(id)
    if(id){
        if(!validate.isValidObjectId(id)){
            return res.status(400).send({status:false,message:"Please enter validsid"})
        }

    } 
    let findblogId = await blogModel.findOne({_id:id})
console.log(findblogId)
   if(!findblogId){
        return res.status(404).send({status:false,message:"blogId not found"})
    } 
    
    let decodedToken= jwt.verify(token,"BlogProject" )

    if(decodedToken.userId!=findblogId.authorId){
        return res.status(403).send({status:false,message:"You are not authorised user"})
    }
    next()
   }
   catch(err){
    return res.status(500).send({status:false,error:err.message})
   }
} 
 


//............................................MIDDLEWARE-FOR AUTHORIZATION..........................................................

 
/* const authorisation = async function (req, res, next) {
    try {
      let token = req.headers["x-api-key"] || req.headers["x-Api-Key"]; //token has jwt token
  
      const id = req.params.blogId;
  console.log(id)
      if (id) {
       // let isValidbookId = mongoose.Types.ObjectId.isValid(id);
        if (!validate.isValidObjectId(id)) {
          return res.status(400).send({ status: false, msg: "bookId is Not Valid type of ObjectId" });
        }
      }
  
      const findbookdatabyId = await blogModel.findOne({_id:id})
      console.log(findbookdatabyId)
      if (!findbookdatabyId) {
        return res.status(400).send({ status: false, msg: "Incorrect BookId" });
      }
  
      let decodedtoken = jwt.verify(token, "BlogProject");
      if(!decodedtoken) return res.status(403).send({status:false,msg:"Incorrect token"})
      if (decodedtoken.userId != findbookdatabyId.authorId)
        return res.status(401).send({ status: false, msg: "Sorry,You cannot access" });
  
      next(); //if match then move the execution to next
    } catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  };  */
module.exports={authentication,authorisation}