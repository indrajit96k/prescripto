import jwt from 'jsonwebtoken';
//admin authentication middleware
const authadmin=async(req,res,next)=>{
    try{
        const {atoken}=req.headers;
        if(!atoken){
            return res.json({success:false,message:"Please Login First"});
        }
        const decodetoken=jwt.verify(atoken,process.env.JWT_SECRET);
        if(decodetoken!==process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
            return res.json({success:false,message:"invalid token received"})

        }
        next();





    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }

}
export default authadmin; 