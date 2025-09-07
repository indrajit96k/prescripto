import jwt from 'jsonwebtoken';
//user authentication middleware
const authuser=async(req,res,next)=>{
    try{
        const {token}=req.headers;
        if(!token){
            return res.json({success:false,message:"Please Login First"});
        }
        const decodetoken=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decodetoken.id; //adding user id to request body

        next();





    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }

}
export default authuser; 