const jwt =require("jsonwebtoken");

const authorize =async function (req,res,next){
    try{
    const token =req.headers["x-auth-token"];
    if(!token){
        return res.status(400).send({status:false,msg:"token required to be set"})
    }
    const decodedToken = jwt.verify(token,"Envigo");
    if(!decodedToken){
        return res.status(400).send({status:false,msg:"invalid token"})
    }else{
        req.userId=decodedToken.userId
        next()
    }
}catch(err){
    return res.status(500).send({status:false,msg:err.message})
}
}

module.exports.authorize=authorize