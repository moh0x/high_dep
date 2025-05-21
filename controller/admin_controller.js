const {Admin} = require('../model/admin_model')
const {User} = require('../model/auth_user')
const {Course} = require('../model/course_controller')
const httpStatus = require('../constant/httpStatus')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')
const { Payment } = require('../model/payments_model')
const signUp =async(req,res)=>{
    try {
        const valid = validationResult(req)
        if (!valid.isEmpty()) {
          return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
        }
        const {email,password} = req.body      
        const admin = await Admin.findOne({email:email});
        if (admin) {
          return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"user already exist"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword =await bcrypt.hash(password,salt)
        const token = jwt.sign({email:email},"token")
        const newAdmin = new Admin({
            email:email,
            password:hashPassword,
            token:token
        })
        await newAdmin.save()  
              res.status(200).json({"status":httpStatus.SUCCESS,"data":newAdmin})     
    } catch (error) {
        console.log(error);
          res.status(400).json({"status":httpStatus.ERROR,"message":"error"})  
    }
}
const login =async(req,res)=>{
  try {
    const{email,password} = req.body
  const admin = await Admin.findOne({email : email},{__v:false});
 const valid = validationResult (req);

if (valid.isEmpty()) {
if (admin) {
   
 const passwordMatch = await bcrypt.compare(password,admin.password);
    if (passwordMatch == true) {
            const adminRet = await Admin.findOne({email : email},{__v:false,password:false});
            res.status(200).json({"status":httpStatus.SUCCESS,"data":adminRet});
        
    } else {
        res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"password not match"});
    }
   } else {
    res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"there is no admin with this email"});
   }
} else {
res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
}
 } catch (error) {
  console.log(error);
  
    res.status(400).json({"status":httpStatus.ERROR,"data":null,"message":"error"});
 }

}
const getAdmins = async(req,res)=>{
  const token = req.headers.token;
  const admin = await Admin.findOne({token:token});
  if (admin.isAdmin == true) {
    const admins = await Admin.find({isAdmin:false}).sort({createdAt:-1});
    res.status(200).json({"status":httpStatus.SUCCESS,"data":admins });
  } else {
     res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"you don't have permission" });
  }
}
const addAdmin =async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    if (adminTrue.isAdmin) {
      const valid = validationResult(req)
      if (!valid.isEmpty()) {
        return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
      }
      const {email,password} = req.body      
      const admin = await Admin.findOne({email:email});
      if (admin) {
        return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"user already exist"})
      }
      const salt = await bcrypt.genSalt(10)
      const hashPassword =await bcrypt.hash(password,salt)
      const token = jwt.sign({email:email},"token")
      const newAdmin = new Admin({
          email:email,
          password:hashPassword,
          token:token
      })
      await newAdmin.save()  
            res.status(200).json({"status":httpStatus.SUCCESS,"data":newAdmin})   
    } else {
      res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"you don't have permission" });
    }  
  } catch (error) {
      console.log(error);
        res.status(400).json({"status":httpStatus.ERROR,"message":"error"})  
  }
}
const editAdminPassword =async(req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
    if (adminTrue.isAdmin) {
      const valid = validationResult(req)
      if (!valid.isEmpty()) {
        return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":valid['errors'][0].msg});
      }
      const {_id,password} = req.body      
      const admin = await Admin.findById(_id);
      if (!admin) {
        return  res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"user not exist"})
      }
      const salt = await bcrypt.genSalt(10)
      const hashPassword =await bcrypt.hash(password,salt)
      const newAdmin = await Admin.findByIdAndUpdate(_id,{
         $set:{
          password:hashPassword
         }
      })
      await newAdmin.save()  
            res.status(200).json({"status":httpStatus.SUCCESS,"data":newAdmin})   
    } else {
      res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"you don't have permission" });
    }  
  } catch (error) {
      console.log(error);
        res.status(400).json({"status":httpStatus.ERROR,"message":"error"})  
  }
}
const deleteAdmin = async (req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
      if (adminTrue.isAdmin) {
       const {_id} = req.body 
       await Admin.findByIdAndDelete(_id); 
       res.status(200).json({"status":httpStatus.SUCCESS,"data":null });
      } else {
        res.status(400).json({"status":httpStatus.FAIL,"data":null,"message":"you don't have permission" });
      }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const getStatics = async (req,res)=>{
  try {
    const token = req.headers.token;
    const adminTrue = await Admin.findOne({token:token})
  
       const activeUsers = await User.find({isVerified:true,isBanned:false}).sort({createdAt:-1})
       const inActiveUsers = await User.find({or:{isVerified:false,isBanned:true}}).sort({createdAt:-1})
       const complteCourses = await Course.find({isFinished:true}).sort({createdAt:-1})
       const inComplteCourses = await Course.find({isFinished:false}).sort({createdAt:-1})
       const completPayments = await Payment.find({status:"finish"}).sort({createdAt:-1})
       const inCompletPayments = await Payment.find({status:"start"}).sort({createdAt:-1})
       res.status(200).json({"status":httpStatus.SUCCESS,"data":{"activeUsers":activeUsers.length,"inActiveUsers":inActiveUsers.length,"complteCourses":complteCourses.length,"inComplteCourses":inComplteCourses.length,"completPayments":completPayments.length,"inCompletPayments":inCompletPayments.length},"message":"you don't have permission" });

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}


module.exports = {signUp,login,getAdmins,addAdmin,editAdminPassword,deleteAdmin,getStatics}