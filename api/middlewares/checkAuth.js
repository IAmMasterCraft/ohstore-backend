const jwt=require('jsonwebtoken')
const env=require('../config/env')
const {User}=require('../models/pImgRel')

module.exports.checkUser=async(req,res,next)=>{
    try {
        const token=req.headers.authorization.split(' ')[1]
        const decoded=jwt.verify(token,env.JWT_KEY)
        const userData=await User.findOne({
            where:{email:decoded.email},
            attributes:['id','email','first_name','last_name','user_status']
        })
        if(userData.email&&(userData.user_status==='active')){
            req.userData=userData
            next()
        }else{
            return res.status(401).json({
                message:'Auth failed'
            })
        }
    } catch (error) {
        return res.status(401).json({
            message:'Auth failed'
        })
    }
}


module.exports.checkAdmin=async(req,res,next)=>{
    try {
        const token=req.headers.authorization.split(' ')[1]
        const decoded=jwt.verify(token,env.JWT_KEY)
        const userData=await User.findOne({where:{email:decoded.email},attributes:['email','user_type']})
        if(userData.user_type==='admin'){
            req.userData=userData
            next()
        }else{
            return res.status(401).json({
                message:'Auth failed'
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            message:'Auth failed'
        })
    }
}