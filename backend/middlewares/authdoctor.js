import jwt from 'jsonwebtoken';
//doc authentication middleware
const authdoctor=async(req,res,next)=>{
    try{
        const {dtoken}=req.headers;
        if(!dtoken){
            return res.json({success:false,message:"Please Login First"});
        }
        const decodetoken=jwt.verify(dtoken,process.env.JWT_SECRET);
        req.docId=decodetoken.id; //adding user id to request body

        next();





    }catch(error){
        console.log(error);
        res.json({success:false,message:error.message});
    }

}
export default authdoctor; 